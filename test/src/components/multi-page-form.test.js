import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import {LanguageContextProvider} from '~/contexts/language';
import {it, expect} from '@jest/globals';
import '@testing-library/jest-dom';

let submitted = false;

const props = {
    action: '//submit-somewhere',
    children: [
        <div className="page-1" key="1" />,
        <div className="page-2" key="2" />,
        <div className="page-3" key="3" />
    ],
    onSubmit() {
        submitted = true;
    }
};

it('handles next, previous and submit', async () => {
    const user = userEvent.setup();

    render(<LanguageContextProvider><MultiPageForm {...props} /></LanguageContextProvider>)
    expect(screen.queryByText('Back')).toHaveAttribute('hidden');
    expect(screen.queryAllByRole('button')).toHaveLength(1);
    await user.click(screen.getByText('Next'));
    expect(screen.queryByText('Submit')).toHaveAttribute('hidden');
    await user.click(screen.getByText('Back'));
    expect(screen.queryByText('Back')).toHaveAttribute('hidden');
    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    expect(screen.queryByText('Next')).toHaveAttribute('hidden');
    await user.click(screen.getByText('Submit'));
    expect(submitted).toBe(true);
});

it('handles validate page failure', async () => {
    const user = userEvent.setup();
    let isValid = false;

    render(<MultiPageForm {...props} validatePage={() => isValid} />);
    await user.click(screen.getByText('Next'));
    // Still on first page
    expect(screen.queryByText('Back')).toHaveAttribute('hidden');
    isValid = true;
    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    isValid = false;
    await user.click(screen.getByText('Submit'));
    expect(submitted).toBe(true);
});

