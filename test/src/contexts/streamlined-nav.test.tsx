import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';

/* eslint-disable camelcase */
jest.mock('~/helpers/cms-fetch', () => ({
    __esModule: true,
    default: jest.fn(() =>
        Promise.resolve({all_flags: [{name: 'streamlined_nav', feature_active: true}]})
    )
}));
jest.mock('~/helpers/posthog', () => ({
    registerProperties: jest.fn()
}));

import {
    SharedDataContextProvider,
    useStreamlinedNav
} from '~/contexts/shared-data';
import {registerProperties} from '~/helpers/posthog';

function Probe() {
    return <span>{useStreamlinedNav() ? 'on' : 'off'}</span>;
}

describe('useStreamlinedNav', () => {
    it('is true once the streamlined_nav flag resolves active', async () => {
        render(
            <SharedDataContextProvider>
                <Probe />
            </SharedDataContextProvider>
        );

        await waitFor(() => expect(screen.getByText('on')).toBeTruthy());
    });

    it('registers streamlined_nav as a PostHog property once flags resolve', async () => {
        render(
            <SharedDataContextProvider>
                <Probe />
            </SharedDataContextProvider>
        );

        await waitFor(() =>
            expect(registerProperties).toHaveBeenCalledWith({streamlined_nav: true})
        );
    });
});
