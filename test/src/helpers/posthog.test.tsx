import React from 'react';
import {render, act} from '@testing-library/preact';
import {getExperimentVariant, useExperimentReader} from '~/helpers/posthog';

type FakePostHog = {
    getFeatureFlag: jest.Mock;
    onFeatureFlags: jest.Mock;
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
        getFeatureFlag: jest.fn(),
        onFeatureFlags: jest.fn(),
        ...overrides
    };
    (window as unknown as {posthog?: FakePostHog}).posthog = ph;
    return ph;
}

afterEach(() => {
    delete (window as unknown as {posthog?: unknown}).posthog;
});

describe('posthog helper', () => {
    it('getExperimentVariant returns undefined when posthog is absent', () => {
        expect(getExperimentVariant('nav-example-item')).toBeUndefined();
    });

    it('getExperimentVariant reads the flag', () => {
        installPostHog({getFeatureFlag: jest.fn().mockReturnValue('tools')});
        expect(getExperimentVariant('nav-example-item')).toBe('tools');
    });
});

describe('useExperimentReader', () => {
    it('returns a reader and re-renders when flags resolve', async () => {
        const ph = {
            getFeatureFlag: jest.fn().mockReturnValueOnce(undefined).mockReturnValue('on'),
            onFeatureFlags: jest.fn()
        };
        (window as unknown as {posthog?: typeof ph}).posthog = ph;

        function Probe() {
            const getVariant = useExperimentReader();
            return <span>{String(getVariant('f'))}</span>;
        }
        const {findByText, getByText} = render(<Probe />);
        getByText('undefined');
        const cb = ph.onFeatureFlags.mock.calls[0][0] as () => void;
        act(() => cb());
        await findByText('on');
    });

    it('polls until PostHog loads (pre-consent), then subscribes and stops polling', () => {
        jest.useFakeTimers();

        function Probe() {
            useExperimentReader();
            return null;
        }
        render(<Probe />);

        const ph = installPostHog();

        act(() => jest.advanceTimersByTime(250));
        expect(ph.onFeatureFlags).toHaveBeenCalledTimes(1);

        act(() => jest.advanceTimersByTime(1000));
        expect(ph.onFeatureFlags).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

    it('backs off while PostHog is unavailable', () => {
        jest.useFakeTimers();
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

        function Probe() {
            useExperimentReader();
            return null;
        }
        render(<Probe />);

        act(() => jest.advanceTimersByTime(60000));
        const delays = setTimeoutSpy.mock.calls.map((call) => call[1]);

        expect(delays.slice(0, 6)).toEqual([250, 500, 1000, 2000, 4000, 5000]);
        expect(Math.max(...(delays as number[]))).toBe(5000);

        setTimeoutSpy.mockRestore();
        jest.useRealTimers();
    });

    it('stops polling on unmount', () => {
        jest.useFakeTimers();

        function Probe() {
            useExperimentReader();
            return null;
        }
        const {unmount} = render(<Probe />);

        unmount();
        const ph = installPostHog();

        act(() => jest.advanceTimersByTime(10000));
        expect(ph.onFeatureFlags).not.toHaveBeenCalled();

        jest.useRealTimers();
    });

    it('does not subscribe or poll when disabled', () => {
        jest.useFakeTimers();
        const ph = installPostHog();

        function Probe() {
            useExperimentReader(false);
            return null;
        }
        render(<Probe />);

        act(() => jest.advanceTimersByTime(10000));
        expect(ph.onFeatureFlags).not.toHaveBeenCalled();
        expect(jest.getTimerCount()).toBe(0);

        jest.useRealTimers();
    });

    it('removes its flag listener on unmount', () => {
        const unsubscribe = jest.fn();
        const ph = installPostHog({onFeatureFlags: jest.fn().mockReturnValue(unsubscribe)});

        function Probe() {
            useExperimentReader();
            return null;
        }
        const {unmount} = render(<Probe />);

        expect(ph.onFeatureFlags).toHaveBeenCalledTimes(1);
        expect(unsubscribe).not.toHaveBeenCalled();
        unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('removes a listener added after polling, on unmount', () => {
        jest.useFakeTimers();

        function Probe() {
            useExperimentReader();
            return null;
        }
        const {unmount} = render(<Probe />);
        const unsubscribe = jest.fn();

        installPostHog({onFeatureFlags: jest.fn().mockReturnValue(unsubscribe)});
        act(() => jest.advanceTimersByTime(250));
        unmount();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
    });
});
