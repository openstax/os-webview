import React from 'react';
import {render, screen, act} from '@testing-library/preact';
import ShellContextProvider from '../../../../helpers/shell-context';
import MemoryRouter from '../../../../helpers/future-memory-router';
import {MainMenuItems} from '~/layouts/default/header/menus/main-menu/main-menu';
import {useDataFromSlug} from '~/helpers/page-data-utils';

jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));

jest.mock('~/helpers/page-data-utils', () => ({
    ...jest.requireActual('~/helpers/page-data-utils'),
    useDataFromSlug: jest.fn()
}));

/* eslint-disable camelcase */

type FakePostHog = {
    __loaded?: boolean;
    getFeatureFlag: jest.Mock;
    onFeatureFlags: jest.Mock;
    register: jest.Mock;
};

function installPostHog(overrides: Partial<FakePostHog> = {}) {
    const ph: FakePostHog = {
        __loaded: true,
        getFeatureFlag: jest.fn().mockReturnValue(undefined),
        onFeatureFlags: jest.fn(),
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

    it('keeps a flag-gated item and its emptied dropdown hidden with no PostHog installed', async () => {
        (useDataFromSlug as jest.Mock).mockReturnValue(
            cmsMenuWithItem({feature_flag: 'nav-example-item'})
        );

        render(<Component />);

        await screen.findByText('Subjects');
        expect(screen.queryByRole('link', {name: 'Example Item'})).toBeNull();
        expect(screen.queryByText('Learn')).toBeNull();
    });

    it('hides a dropdown whose children are all gated off, and shows it when one resolves', async () => {
        let flagsLoaded = false;
        const ph = installPostHog({
            getFeatureFlag: jest.fn(() => (flagsLoaded ? true : undefined))
        });
        (useDataFromSlug as jest.Mock).mockReturnValue([
            {
                name: 'Learn',
                key: 'learn-dropdown',
                menu: [
                    {label: 'Gated Item', partial_url: '/gated', feature_flag: 'nav-gated'}
                ]
            }
        ]);

        render(<Component />);
        await screen.findByText('Subjects');

        expect(screen.queryByText('Learn')).toBeNull();

        flagsLoaded = true;
        const allCbs = ph.onFeatureFlags.mock.calls.map((call: [() => void]) => call[0]);
        act(() => allCbs.forEach((cb: () => void) => cb()));

        await screen.findByText('Learn');
    });

    it('hides a dropdown whose only child has no name or label', async () => {
        (useDataFromSlug as jest.Mock).mockReturnValue([
            {name: 'Learn', key: 'learn-dropdown', menu: [{partial_url: '/unlabeled'}]}
        ]);

        render(<Component />);

        await screen.findByText('Subjects');
        expect(screen.queryByText('Learn')).toBeNull();
    });

    it('keeps a dropdown that still has a visible child', async () => {
        installPostHog();
        (useDataFromSlug as jest.Mock).mockReturnValue([
            {
                name: 'Learn',
                key: 'learn-dropdown',
                menu: [
                    {label: 'Gated Item', partial_url: '/gated', feature_flag: 'nav-gated'},
                    {label: 'Plain Item', partial_url: '/plain'}
                ]
            }
        ]);

        render(<Component />);

        await screen.findByRole('link', {name: 'Plain Item'});
        expect(screen.queryByRole('link', {name: 'Gated Item'})).toBeNull();
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

    it('shows the Tools label for the Products dropdown experiment', async () => {
        installPostHog({
            getFeatureFlag: jest.fn((flag: string) =>
                flag === 'nav-products-label' ? 'tools' : undefined
            )
        });
        (useDataFromSlug as jest.Mock).mockReturnValue([
            {
                name: 'Products',
                key: 'products-dropdown',
                menu: [{label: 'Example Item', partial_url: '/example'}]
            }
        ]);

        render(<Component />);

        await screen.findByText('Tools');
        expect(screen.queryByText('Products')).toBeNull();
    });

    it('relabels the Products dropdown when its flag resolves after render', async () => {
        let flagsLoaded = false;
        const ph = installPostHog({
            getFeatureFlag: jest.fn((flag: string) =>
                flagsLoaded && flag === 'nav-products-label' ? 'tools' : undefined
            )
        });
        (useDataFromSlug as jest.Mock).mockReturnValue([
            {
                name: 'Products',
                key: 'products-dropdown',
                menu: [{label: 'Example Item', partial_url: '/example'}]
            }
        ]);

        render(<Component />);
        await screen.findByText('Products');

        flagsLoaded = true;
        const allCbs = ph.onFeatureFlags.mock.calls.map((call: [() => void]) => call[0]);

        act(() => allCbs.forEach((cb: () => void) => cb()));
        await screen.findByText('Tools');
    });
});
