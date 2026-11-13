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
    capture: jest.Mock;
    register: jest.Mock;
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
        getFeatureFlag: jest.fn().mockReturnValue(undefined),
        onFeatureFlags: jest.fn(),
        capture: jest.fn(),
        register: jest.fn(),
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

const cmsMenuWithFlaggedItem = [
    {
        name: 'Products',
        key: 'products-dropdown',
        menu: [
            {
                label: 'Example Item',
                partial_url: '/example',
                feature_flag: 'nav-example-item'
            }
        ]
    }
];

describe('MainMenuItems — generic flag resolver', () => {
    it('hides a flag-gated CMS menu item when flag is falsy', async () => {
        installPostHog({
            getFeatureFlag: jest.fn().mockReturnValue(undefined)
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(cmsMenuWithFlaggedItem);

        render(<Component />);

        // Wait for SubjectsMenu to appear
        await screen.findByText('Subjects');

        // The flag-gated item in the Products dropdown should be hidden
        expect(screen.queryByRole('link', {name: 'Example Item'})).toBeNull();
    });

    it('shows a flag-gated CMS menu item when flag becomes truthy', async () => {
        let flagsLoaded = false;
        const ph = installPostHog({
            getFeatureFlag: jest.fn((flag: string) => {
                if (!flagsLoaded) {
                    return undefined;
                }
                if (flag === 'nav-example-item') {
                    return true;
                }
                return undefined;
            })
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(cmsMenuWithFlaggedItem);

        render(<Component />);
        await screen.findByText('Subjects');

        // Before flags load, the item is hidden
        expect(screen.queryByRole('link', {name: 'Example Item'})).toBeNull();

        // Simulate PostHog flags resolving — triggers forceRender in useExperimentReader
        flagsLoaded = true;
        const allCbs = ph.onFeatureFlags.mock.calls.map(
            (call: [() => void]) => call[0]
        );
        act(() => allCbs.forEach((cb: () => void) => cb()));

        await screen.findByRole('link', {name: 'Example Item'});
    });
});
