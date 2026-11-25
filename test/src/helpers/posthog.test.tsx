import React from 'react';
import {render, act} from '@testing-library/preact';
import {
    getExperimentVariant,
    captureEvent,
    registerProperties,
    useExperimentReader,
    whenPostHogLoads
} from '~/helpers/posthog';

type FakePostHog = {
    __loaded?: boolean;
    getFeatureFlag: jest.Mock;
    onFeatureFlags: jest.Mock;
    capture: jest.Mock;
    identify: jest.Mock;
    reset: jest.Mock;
    register: jest.Mock;
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
        __loaded: true,
        getFeatureFlag: jest.fn(),
        onFeatureFlags: jest.fn(),
        capture: jest.fn(),
        identify: jest.fn(),
        reset: jest.fn(),
        register: jest.fn(),
        ...overrides
    };

    (window as unknown as {posthog?: FakePostHog}).posthog = ph;
    return ph;
}

function Probe({enabled}: {enabled?: boolean}) {
    useExperimentReader(enabled);
    return null;
}

afterEach(() => {
    delete (window as unknown as {posthog?: unknown}).posthog;
    jest.useRealTimers();
    jest.restoreAllMocks();
});

describe('posthog helper', () => {
    it('getExperimentVariant returns undefined when posthog is absent', () => {
        expect(getExperimentVariant('nav-example-item')).toBeUndefined();
    });

    it('getExperimentVariant reads the flag', () => {
        installPostHog({getFeatureFlag: jest.fn().mockReturnValue('tools')});
        expect(getExperimentVariant('nav-products-label')).toBe('tools');
    });

    it('getExperimentVariant does not read from the bootstrap stub', () => {
        const ph = installPostHog({__loaded: false});

        expect(getExperimentVariant('nav-example-item')).toBeUndefined();
        expect(ph.getFeatureFlag).not.toHaveBeenCalled();
    });

    it('captureEvent no-ops without posthog', () => {
        delete (window as unknown as {posthog?: unknown}).posthog;
        expect(() => captureEvent('thing_clicked')).not.toThrow();
    });

    it('captureEvent forwards to posthog', () => {
        const ph = installPostHog();
        captureEvent('thing_clicked', {a: 1});
        expect(ph.capture).toHaveBeenCalledWith('thing_clicked', {a: 1});
    });

    it('registerProperties no-ops without posthog', () => {
        delete (window as unknown as {posthog?: unknown}).posthog;
        expect(() => registerProperties({streamlined_nav: true})).not.toThrow();
    });

    it('registerProperties forwards to posthog', () => {
        const ph = installPostHog();
        registerProperties({streamlined_nav: true});
        expect(ph.register).toHaveBeenCalledWith({streamlined_nav: true});
    });
});

describe('whenPostHogLoads', () => {
    it('calls back at once when PostHog is loaded', () => {
        const ph = installPostHog();
        const callback = jest.fn();

        whenPostHogLoads(callback);
        expect(callback).toHaveBeenCalledWith(ph);
    });

    it('waits for PostHog to load, and can be cancelled', () => {
        jest.useFakeTimers();
        const callback = jest.fn();
        const late = jest.fn();

        whenPostHogLoads(callback);
        const cancel = whenPostHogLoads(late);

        cancel();
        const ph = installPostHog();

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(callback).toHaveBeenCalledWith(ph);
        expect(late).not.toHaveBeenCalled();
    });
});

describe('useExperimentReader', () => {
    it('returns a reader and re-renders when flags resolve', async () => {
        const ph = installPostHog({
            getFeatureFlag: jest.fn().mockReturnValueOnce(undefined).mockReturnValue('on')
        });

        function Reader() {
            const getVariant = useExperimentReader();

            return <span>{String(getVariant('f'))}</span>;
        }
        const {findByText, getByText} = render(<Reader />);

        getByText('undefined');
        const cb = ph.onFeatureFlags.mock.calls[0][0] as () => void;

        act(() => cb());
        await findByText('on');
    });

    it('polls until PostHog loads (pre-consent), then subscribes and stops polling', () => {
        jest.useFakeTimers();
        render(<Probe />);

        const ph = installPostHog();

        act(() => jest.advanceTimersByTime(250));
        expect(ph.onFeatureFlags).toHaveBeenCalledTimes(1);

        act(() => jest.advanceTimersByTime(1000));
        expect(ph.onFeatureFlags).toHaveBeenCalledTimes(1);
    });

    it('waits for the SDK to initialize before subscribing, ignoring the stub', () => {
        jest.useFakeTimers();
        const unsubscribe = jest.fn();
        const ph = installPostHog({
            __loaded: false,
            onFeatureFlags: jest.fn().mockReturnValue(unsubscribe)
        });
        const {unmount} = render(<Probe />);

        act(() => jest.advanceTimersByTime(2000));
        expect(ph.onFeatureFlags).not.toHaveBeenCalled();

        ph.__loaded = true;
        act(() => jest.advanceTimersByTime(5000));
        expect(ph.onFeatureFlags).toHaveBeenCalledTimes(1);

        unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('backs off while PostHog is unavailable', () => {
        jest.useFakeTimers();
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

        render(<Probe />);
        act(() => jest.advanceTimersByTime(60000));
        const delays = setTimeoutSpy.mock.calls.map((call) => call[1]);

        expect(delays.slice(0, 6)).toEqual([250, 500, 1000, 2000, 4000, 5000]);
        expect(Math.max(...(delays as number[]))).toBe(5000);
    });

    it('stops polling on unmount', () => {
        jest.useFakeTimers();
        const {unmount} = render(<Probe />);

        unmount();
        const ph = installPostHog();

        act(() => jest.advanceTimersByTime(10000));
        expect(ph.onFeatureFlags).not.toHaveBeenCalled();
    });

    it('does not subscribe or poll when disabled', () => {
        jest.useFakeTimers();
        const ph = installPostHog();

        render(<Probe enabled={false} />);

        act(() => jest.advanceTimersByTime(10000));
        expect(ph.onFeatureFlags).not.toHaveBeenCalled();
        expect(jest.getTimerCount()).toBe(0);
    });

    it('removes its flag listener on unmount', () => {
        const unsubscribe = jest.fn();
        const ph = installPostHog({onFeatureFlags: jest.fn().mockReturnValue(unsubscribe)});
        const {unmount} = render(<Probe />);

        expect(ph.onFeatureFlags).toHaveBeenCalledTimes(1);
        expect(unsubscribe).not.toHaveBeenCalled();
        unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('tolerates a client whose onFeatureFlags returns no unsubscribe', () => {
        installPostHog();
        const {unmount} = render(<Probe />);

        expect(() => unmount()).not.toThrow();
    });
});
