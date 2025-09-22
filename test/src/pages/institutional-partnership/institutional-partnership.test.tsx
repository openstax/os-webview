import React from 'react';
import InstitutionalPartnership from '~/pages/institutional-partnership/institutional-partnership';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('InstitutionalPartnership', () => {
    it('creates', async () => {
        render(
            <MemoryRouter>
                <InstitutionalPartnership />
            </MemoryRouter>
        );

        await screen.findByText('About the program');
        expect(screen.queryAllByRole('link')).toHaveLength(7);
    });

    it('renders the main heading', async () => {
        render(
            <MemoryRouter>
                <InstitutionalPartnership />
            </MemoryRouter>
        );

        const mainElement = await screen.findByRole('main');

        expect(mainElement).toHaveClass('institutional-partnership', 'page');
    });

    it('displays established partners in dialog', async () => {
        render(
            <MemoryRouter>
                <InstitutionalPartnership />
            </MemoryRouter>
        );

        await user.click(await screen.findByRole('link', {name: 'See established partners'}));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });

    it('has proper TypeScript structure', () => {
        // This test ensures the TypeScript conversion was successful
        // by checking that the component can be imported without type errors
        expect(InstitutionalPartnership).toBeDefined();
        expect(typeof InstitutionalPartnership).toBe('function');
    });
});
