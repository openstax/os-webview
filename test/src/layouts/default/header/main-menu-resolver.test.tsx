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
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
        getFeatureFlag: jest.fn().mockReturnValue(undefined),
        onFeatureFlags: jest.fn(),
        capture: jest.fn(),
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
        type: 'dropdown' as const,
        region: 'main' as const,
        name: 'Products',
        key: 'products-dropdown',
        menu: [
            {
                type: 'link' as const,
                region: 'main' as const,
                label: 'For K12 Teachers',
                partial_url: '/k12',
                feature_flag: 'nav-k12-item'
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
        expect(screen.queryByRole('link', {name: 'For K12 Teachers'})).toBeNull();
    });

    it('shows a flag-gated CMS menu item when flag becomes truthy', async () => {
        let flagsLoaded = false;
        const ph = installPostHog({
            getFeatureFlag: jest.fn((flag: string) => {
                if (!flagsLoaded) {
                    return undefined;
                }
                if (flag === 'nav-k12-item') {
                    return true;
                }
                return undefined;
            })
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(cmsMenuWithFlaggedItem);

        render(<Component />);
        await screen.findByText('Subjects');

        // Before flags load, the item is hidden
        expect(screen.queryByRole('link', {name: 'For K12 Teachers'})).toBeNull();

        // Simulate PostHog flags resolving — triggers forceRender in useExperimentReader
        flagsLoaded = true;
        const allCbs = ph.onFeatureFlags.mock.calls.map(
            (call: [() => void]) => call[0]
        );
        act(() => allCbs.forEach((cb: () => void) => cb()));

        await screen.findByRole('link', {name: 'For K12 Teachers'});
    });

    it('hides SubjectsMenu hardcoded K12 item when nav-k12-item flag is truthy', async () => {
        let flagsLoaded = false;
        const ph = installPostHog({
            getFeatureFlag: jest.fn((flag: string) => {
                if (!flagsLoaded) {
                    return undefined;
                }
                if (flag === 'nav-k12-item') {
                    return true;
                }
                return undefined;
            })
        });
        (useDataFromSlug as jest.Mock).mockReturnValue([]);

        render(<Component />);

        // SubjectsMenu uses cmsFetch (not useDataFromSlug), so subjects still load
        await screen.findByText('Math');

        // K12 in-subjects link is present before flags load
        expect(screen.getByRole('link', {name: '🍎 For K12 Teachers'})).toBeDefined();

        // Simulate flags loading — triggers re-render in SubjectsMenu via useExperiment
        flagsLoaded = true;
        const allCbs = ph.onFeatureFlags.mock.calls.map(
            (call: [() => void]) => call[0]
        );
        act(() => allCbs.forEach((cb: () => void) => cb()));

        // The hardcoded in-Subjects K12 link should now be hidden
        expect(screen.queryByRole('link', {name: '🍎 For K12 Teachers'})).toBeNull();
    });
});
