import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import HowUsing from '~/pages/adoption/how-using/how-using';

const props = {
    selectedBooks: [],
    selectedBooks: [{
        text: 'First Book',
        value: 'first-book'
    }]
};

it('creates', (done) => {
    render(<HowUsing {...props} />);
    setTimeout(() => {
        expect(screen.getByText('How are you using First Book', {exact: false}));
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        done();
    }, 0);
});
