import React from 'react';
import {render, screen} from '@testing-library/preact';
import useLayoutContext, { LayoutContextProvider, LayoutName } from '~/contexts/layout';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

const landingData = {
    title: 'title', layout: [
    {
        value: {
            navLinks: [{
                text: 'Landing page link',
                target: {
                    type: 'href',
                    value: 'whatever'
                }
            }]
        }
    }]
};

function Component() {
    const {Layout, setLayoutParameters} = useLayoutContext();

    React.useEffect(
        () => {
            setLayoutParameters({name: 'landing', data: landingData});
            // Exercise the code that tests for equal setting
            setTimeout(() => setLayoutParameters({name: 'landing', data: landingData}), 5);
            setTimeout(() => setLayoutParameters(undefined), 10);
        },
        [setLayoutParameters]
    );

    return (
        <Layout>
            <div>No menus</div>
        </Layout>
    );
}

function SingleLayout({name}: {name: LayoutName}) {
    const {Layout, setLayoutParameters} = useLayoutContext();

    React.useEffect(
        () => {
            setLayoutParameters({name, data: landingData});
        },
        [name, setLayoutParameters]
    );

    return (
        <Layout>
            <div>Page content</div>
        </Layout>
    );
}

function renderWhileLayoutLoads(name: LayoutName) {
    render(
        <MemoryRouter>
            <LayoutContextProvider>
                <SingleLayout name={name} />
            </LayoutContextProvider>
        </MemoryRouter>
    );
}

jest.useFakeTimers();
jest.mock('~/layouts/default/microsurvey-popup/microsurvey-popup', () => jest.fn());
jest.mock('~/layouts/default/header/header', () => jest.fn());
jest.mock('~/layouts/default/lower-sticky-note/lower-sticky-note', () => jest.fn());
jest.mock('~/layouts/default/footer/footer', () => jest.fn());
jest.mock('~/layouts/default/takeover-dialog/takeover-dialog', () => jest.fn());

describe('layout-context', () => {
    it('renders a landing page', async () => {
        render(
            <MemoryRouter>
                <LayoutContextProvider>
                    <Component />
                </LayoutContextProvider>
            </MemoryRouter>
        );
        jest.runAllTimers();
        await screen.findByText('No menus');
    });
    it('shows the default nav while the default layout loads', async () => {
        renderWhileLayoutLoads('default');
        expect(document.querySelector('#header')).toBeTruthy();
        await screen.findByText('Page content');
    });
    it('does not show the default nav while a landing layout loads', async () => {
        renderWhileLayoutLoads('landing');
        expect(document.querySelector('#header')).toBeNull();
        await screen.findByText('Page content');
    });
});
