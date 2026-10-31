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

    it('keeps polling when PostHog is still unavailable', () => {
        jest.useFakeTimers();

        function Probe() {
            useExperimentReader();
            return null;
        }
        render(<Probe />);

        act(() => jest.advanceTimersByTime(500));
        expect((window as unknown as {posthog?: unknown}).posthog).toBeUndefined();

        jest.useRealTimers();
    });
});
