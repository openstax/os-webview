import React from 'react';
import {render, screen, act} from '@testing-library/preact';
import {
    getExperimentVariant,
    captureEvent,
    identifyUser,
    resetUser,
    registerProperties,
    useExperimentReader
} from '~/helpers/posthog';

type FakePostHog = {
    getFeatureFlag: jest.Mock;
    onFeatureFlags: jest.Mock;
    capture: jest.Mock;
    identify: jest.Mock;
    reset: jest.Mock;
    register: jest.Mock;
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
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

afterEach(() => {
    delete (window as unknown as {posthog?: unknown}).posthog;
});

describe('posthog helper', () => {
    it('getExperimentVariant returns undefined when posthog is absent', () => {
        expect(getExperimentVariant('nav-products-label')).toBeUndefined();
    });

    it('getExperimentVariant reads the flag', () => {
        installPostHog({getFeatureFlag: jest.fn().mockReturnValue('tools')});
        expect(getExperimentVariant('nav-products-label')).toBe('tools');
    });

    it('captureEvent no-ops without posthog', () => {
        expect(() => captureEvent('thing_clicked')).not.toThrow();
    });

    it('captureEvent forwards to posthog', () => {
        const ph = installPostHog();
        captureEvent('thing_clicked', {a: 1});
        expect(ph.capture).toHaveBeenCalledWith('thing_clicked', {a: 1});
    });

    it('identifyUser no-ops without posthog', () => {
        expect(() => identifyUser('uuid-1')).not.toThrow();
    });

    it('identifyUser forwards to posthog', () => {
        const ph = installPostHog();
        identifyUser('uuid-1', {isInstructor: true});
        expect(ph.identify).toHaveBeenCalledWith('uuid-1', {isInstructor: true});
    });

    it('resetUser forwards to posthog', () => {
        const ph = installPostHog();
        resetUser();
        expect(ph.reset).toHaveBeenCalled();
    });

    it('registerProperties forwards to posthog', () => {
        const ph = installPostHog();
        registerProperties({streamlined_nav: true});
        expect(ph.register).toHaveBeenCalledWith({streamlined_nav: true});
    });
});

describe('useExperimentReader', () => {
    it('returns a reader and re-renders when flags resolve', async () => {
        const ph = {
            getFeatureFlag: jest.fn().mockReturnValueOnce(undefined).mockReturnValue('on'),
            onFeatureFlags: jest.fn(),
            capture: jest.fn()
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
        delete (window as unknown as {posthog?: unknown}).posthog;
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
});
