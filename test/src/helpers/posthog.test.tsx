import React from 'react';
import {render, screen, act} from '@testing-library/preact';
import {
    getExperimentVariant,
    captureEvent,
    useExperiment,
    useExperimentReader
} from '~/helpers/posthog';

type FakePostHog = {
    getFeatureFlag: jest.Mock;
    onFeatureFlags: jest.Mock;
    capture: jest.Mock;
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
        getFeatureFlag: jest.fn(),
        onFeatureFlags: jest.fn(),
        capture: jest.fn(),
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

    it('useExperiment returns control then updates when flags resolve', async () => {
        const ph = installPostHog({
            getFeatureFlag: jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValue('tools')
        });

        function Probe() {
            const variant = useExperiment('nav-products-label');
            return <span>{String(variant)}</span>;
        }

        render(<Probe />);
        screen.getByText('undefined');

        const cb = ph.onFeatureFlags.mock.calls[0][0] as () => void;
        act(() => cb());
        await screen.findByText('tools');
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
});
