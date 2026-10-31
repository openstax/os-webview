import React from 'react';
import {render, screen, act} from '@testing-library/preact';
import ShellContextProvider from '../../../../helpers/shell-context';
import MemoryRouter from '../../../../helpers/future-memory-router';
import {MainMenuItems} from '~/layouts/default/header/menus/main-menu/main-menu';
import {useDataFromSlug} from '~/helpers/page-data-utils';

jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));

// Mock page-data-utils so we can control what useDataFromSlug('oxmenus') returns.
// We spread requireActual so everything else (fetchFromCMS, etc.) still works.
jest.mock('~/helpers/page-data-utils', () => ({
    ...jest.requireActual('~/helpers/page-data-utils'),
    useDataFromSlug: jest.fn()
}));

/* eslint-disable camelcase */

type FakePostHog = {
    getFeatureFlag: jest.Mock;
    onFeatureFlags: jest.Mock;
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
        getFeatureFlag: jest.fn().mockReturnValue(undefined),
        onFeatureFlags: jest.fn(),
        ...overrides
    };
    (window as unknown as {posthog?: FakePostHog}).posthog = ph;
    return ph;
}

afterEach(() => {
    delete (window as unknown as {posthog?: unknown}).posthog;
    (useDataFromSlug as jest.Mock).mockReset();
});

function Component() {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={['/']}>
                <ul>
                    <MainMenuItems />
                </ul>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

function cmsMenuWithItem(flagFields: Record<string, string> = {}) {
    return [
        {
            name: 'Learn',
            key: 'learn-dropdown',
            menu: [
                {
                    label: 'Example Item',
                    partial_url: '/example',
                    ...flagFields
                }
            ]
        }
    ];
}

describe('MainMenuItems — generic flag resolver', () => {
    it('renders an unflagged item immediately, with no PostHog installed', async () => {
        (useDataFromSlug as jest.Mock).mockReturnValue(cmsMenuWithItem());

        render(<Component />);

        await screen.findByText('Subjects');
        await screen.findByRole('link', {name: 'Example Item'});
    });

    it('hides a flag-gated item when the flag is falsy', async () => {
        installPostHog();
        (useDataFromSlug as jest.Mock).mockReturnValue(
            cmsMenuWithItem({feature_flag: 'nav-example-item'})
        );

        render(<Component />);

        await screen.findByText('Subjects');
        expect(screen.queryByRole('link', {name: 'Example Item'})).toBeNull();
    });

    it('shows a flag-gated item once flags resolve truthy', async () => {
        let flagsLoaded = false;
        const ph = installPostHog({
            getFeatureFlag: jest.fn((flag: string) => {
                if (!flagsLoaded) {
                    return undefined;
                }
                return flag === 'nav-example-item' ? true : undefined;
            })
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(
            cmsMenuWithItem({feature_flag: 'nav-example-item'})
        );

        render(<Component />);
        await screen.findByText('Subjects');

        expect(screen.queryByRole('link', {name: 'Example Item'})).toBeNull();

        flagsLoaded = true;
        const allCbs = ph.onFeatureFlags.mock.calls.map((call: [() => void]) => call[0]);
        act(() => allCbs.forEach((cb: () => void) => cb()));

        await screen.findByRole('link', {name: 'Example Item'});
    });

    it('shows a flag-gated item when flag_value matches the resolved variant', async () => {
        installPostHog({
            getFeatureFlag: jest.fn().mockReturnValue('control')
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(
            cmsMenuWithItem({feature_flag: 'nav-example-item', flag_value: 'control'})
        );

        render(<Component />);

        await screen.findByText('Subjects');
        await screen.findByRole('link', {name: 'Example Item'});
    });

    it('hides a flag-gated item when flag_value does not match the resolved variant', async () => {
        installPostHog({
            getFeatureFlag: jest.fn().mockReturnValue('tools')
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(
            cmsMenuWithItem({feature_flag: 'nav-example-item', flag_value: 'control'})
        );

        render(<Component />);

        await screen.findByText('Subjects');
        expect(screen.queryByRole('link', {name: 'Example Item'})).toBeNull();
    });
});
