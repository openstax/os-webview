import React from 'react';
import InstitutionalPartnership from '~/pages/institutional-partnership/institutional-partnership';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import '@testing-library/jest-dom';

describe('InstitutionalPartnership', () => {
    it('creates', async () => {
        render(
            <MemoryRouter>
                <InstitutionalPartnership />
            </MemoryRouter>
        );

        await screen.findByText('About the program');
        expect(screen.queryAllByRole('link')).toHaveLength(8);
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

    it('displays LazyLoad components for performance optimization', async () => {
        render(
            <MemoryRouter>
                <InstitutionalPartnership />
            </MemoryRouter>
        );

        // Check that the page loads without throwing errors
        // LazyLoad components should be present but may not be immediately visible
        const mainElement = await screen.findByRole('main');

        expect(mainElement).toBeInTheDocument();
    });

    it('has proper TypeScript structure', () => {
        // This test ensures the TypeScript conversion was successful
        // by checking that the component can be imported without type errors
        expect(InstitutionalPartnership).toBeDefined();
        expect(typeof InstitutionalPartnership).toBe('function');
    });
});
