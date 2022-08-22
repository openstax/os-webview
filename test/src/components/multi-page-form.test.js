import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';

let wrapper;
let submitted = false;

const props = {
    action: '//submit-somewhere',
    children: [<div className="page-1"/>, <div className="page-2" />, <div className="page-3" />],
    onSubmit() {
        submitted = true;
    }
};

it('handles next and submit', async () => {
    const user = userEvent.setup();

    render(<MultiPageForm {...props} />)
    expect(screen.queryByText('Back')).toHaveAttribute('hidden');
    expect(screen.queryAllByRole('button')).toHaveLength(1);
    await user.click(screen.getByText('Next'));
    expect(screen.queryByText('Submit')).toHaveAttribute('hidden');
    await user.click(screen.getByText('Next'));
    expect(screen.queryByText('Next')).toHaveAttribute('hidden');
    await user.click(screen.getByText('Submit'));
    expect(submitted).toBe(true);
});
