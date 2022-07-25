import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {FlagContextProvider} from '~/components/shell/flag-context';
import {UserContextProvider} from '~/contexts/user';
import {render, screen} from '@testing-library/preact';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import MyOpenStax from '~/pages/my-openstax/my-openstax';

test(`renders navigator`, async () => {
    render(
        <FlagContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route>
                        <UserContextProvider>
                            <MyOpenStax />
                        </UserContextProvider>
                    </Route>
                </Routes>
            </BrowserRouter>
        </FlagContextProvider>
    );

    const nav = await screen.findByRole('navigation', {hidden: true});

    expect(await within(nav).findAllByText(/^My/)).toHaveLength(3);
});
