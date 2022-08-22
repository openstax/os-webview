import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../helpers/shell-context';
import {BrowserRouter} from 'react-router-dom';
import {within} from '@testing-library/dom';
import MyOpenStax from '~/pages/my-openstax/my-openstax';

test(`renders navigator`, async () => {
    render(
        <ShellContextProvider>
            <BrowserRouter>
                <MyOpenStax />
            </BrowserRouter>
        </ShellContextProvider>
    );

    const nav = await screen.findByRole('navigation', {hidden: true});

    expect(await within(nav).findAllByText(/^My/)).toHaveLength(3);
});
