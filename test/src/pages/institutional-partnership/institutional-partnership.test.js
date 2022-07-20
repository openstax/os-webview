import React from 'react';
import InstitutionalPartnership from '~/pages/institutional-partnership/institutional-partnership';
import {render, screen} from '@testing-library/preact';

describe('InstitutionalPartnership', () => {
    it('creates', async () => {
        render(
            <InstitutionalPartnership />
        );

        await screen.findByText('About the program');
        expect(screen.queryAllByRole('link')).toHaveLength(2);
    });
});
