import React from 'react';
import {render, screen} from '@testing-library/preact';
import useLayoutContext, { LayoutContextProvider } from '~/contexts/layout';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

function Component() {
    const {Layout, setLayoutParameters} = useLayoutContext();

    React.useEffect(
        () => {
            setLayoutParameters({
                name: 'landing',
                data: {
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
                }
            });
            // Exercise the code that tests for equal setting
            setTimeout(() => setLayoutParameters({
                name: 'landing',
                data: {
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
                }
            }), 5);
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
});
