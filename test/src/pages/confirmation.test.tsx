import React from 'react';
import {render, screen} from '@testing-library/preact';
import Confirmation from '~/pages/confirmation/confirmation';
import {MemoryRouter} from 'react-router-dom';

describe('confirmation', () => {
    it('does a contact thank you', () => {
        render(
            <MemoryRouter initialEntries={['/confirmation/contact']}>
                <Confirmation />
            </MemoryRouter>
        );
        expect(screen.getByRole('heading').textContent).toBe('Thanks for contacting us');
    });
    it('does an errata thank you', async () => {
        render(
            <MemoryRouter initialEntries={['/confirmation/errata?id=7199']}>
                <Confirmation />
            </MemoryRouter>
        );
        await screen.findByText('Date Submitted');
        expect(screen.getByRole('heading').textContent).toBe('Thanks for your help!');
    });
    it('handles errata-confirmation', async () => {
        render(
            <MemoryRouter initialEntries={['/errata-confirmation?id=7199']}>
                <Confirmation />
            </MemoryRouter>
        );
        await screen.findByText('Date Submitted');
        expect(screen.getByRole('heading').textContent).toBe('Thanks for your help!');
    });
});
