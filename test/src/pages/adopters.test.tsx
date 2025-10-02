import React from 'react';
import {render, screen} from '@testing-library/preact';
import AdoptersPage from '~/pages/adopters/adopters';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

const pageData = [
    {
        name: 'First one',
        description: 'First description',
        website: 'http://first.one'
    },
    {
        name: 'Second one',
        description: 'Second description',
        website: 'http://second.one'
    }
];

global.fetch = jest.fn().mockReturnValue(
    Promise.resolve({
        ok: true,
        json() {
            return Promise.resolve(pageData);
        }
    })
);

describe('Adopters page', () => {
    it('renders', async () => {
        render(
            <MemoryRouter initialEntries={['/adopters']}>
                <AdoptersPage />
            </MemoryRouter>
        );
        await screen.findByText('Complete list', {exact: false});
        expect(screen.getAllByRole('listitem')).toHaveLength(pageData.length);
    });
});
