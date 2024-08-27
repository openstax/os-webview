import React from 'react';
import {render, screen} from '@testing-library/preact';
import useLayoutContext, { LayoutContextProvider } from '~/contexts/layout';

function Component() {
    const {Layout, setLayoutParameters} = useLayoutContext();

    React.useEffect(
        () => setLayoutParameters({name: 'landing', data: {title: 'title', layout: [
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
            }
        ]}}),
        [setLayoutParameters]
    );

    return (
        <Layout>
            <div>No menus</div>
        </Layout>
    );
}

describe('layout-context', () => {
    it('renders a landing page', async () => {
        render(
            <LayoutContextProvider>
                <Component />
            </LayoutContextProvider>
        );
        await screen.findByText('Landing page link');
    });
});
