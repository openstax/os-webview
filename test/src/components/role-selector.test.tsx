import React from 'react';
import {render, screen} from '@testing-library/preact';
import RoleSelector from '~/components/role-selector/role-selector';
import {MemoryRouter} from 'react-router-dom';
import {LanguageContextProvider} from '~/contexts/language';

// @ts-expect-error does not exist on
const {routerFuture} = global;

describe('role-selector', () => {
    it('renders student content', async () => {
        render(
            <LanguageContextProvider>
                <MemoryRouter future={routerFuture}>
                    <RoleSelector value="Student" setValue={jest.fn()}>
                        <h1>Student stuff</h1>
                        <h1>Instructor stuff</h1>
                    </RoleSelector>
                </MemoryRouter>
            </LanguageContextProvider>
        );
        expect(
            (await screen.findByRole('heading', {level: 1})).textContent
        ).toBe('Student stuff');
    });
});
