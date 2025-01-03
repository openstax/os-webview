import React from 'react';
import {render, screen} from '@testing-library/preact';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';

function Component() {
    const {innerHeight} = useWindowContext();

    return <div>{innerHeight}</div>;
}

describe('window context', () => {
    it('refreshes on scroll', async () => {
        render(
            <WindowContextProvider>
                <Component />
            </WindowContextProvider>
        );
        window.innerHeight = 10;
        screen.getByText('768');
        window.dispatchEvent(new Event('scroll'));
        await screen.findByText('10');
        window.innerHeight = 768;
    });
    it('refreshes on resize', async () => {
        render(
            <WindowContextProvider>
                <Component />
            </WindowContextProvider>
        );
        window.innerHeight = 10;
        screen.getByText('768');
        window.dispatchEvent(new Event('resize'));
        await screen.findByText('10');
    });
});
