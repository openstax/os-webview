import React from 'react';
import InstitutionalPartnership from '~/pages/institutional-partnership/institutional-partnership';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect} from '@jest/globals';

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
});
