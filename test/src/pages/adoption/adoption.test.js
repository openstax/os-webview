import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AdoptionForm from '~/pages/adoption/adoption';

// More needs to be done with this
test('creates with role selector', (done) => {
    render(<AdoptionForm />);
    setTimeout(() => {
        expect(screen.queryAllByRole('textbox')).toHaveLength(0);
        done();
    }, 0);
});
