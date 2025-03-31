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

describe('multi-page-form', () => {
    it('handles next, previous and submit', async () => {
        const user = userEvent.setup();

        render(
            <LanguageContextProvider>
                <MultiPageForm {...props} submitting={false} />
            </LanguageContextProvider>
        );
        expect(screen.queryByText('Back')?.getAttribute('hidden')).toBe('');
        expect(screen.queryAllByRole('button')).toHaveLength(1);
        await user.click(screen.getByText('Next'));
        expect(screen.queryByText('Submit')?.getAttribute('hidden')).toBe('');
        await user.click(screen.getByText('Back'));
        expect(screen.queryByText('Back')?.getAttribute('hidden')).toBe('');
        await user.click(screen.getByText('Next'));
        await user.click(screen.getByText('Next'));
        expect(screen.queryByText('Next')?.getAttribute('hidden')).toBe('');
        await user.click(screen.getByText('Submit'));
        expect(submitted).toBe(true);
    });

    it('handles validate page failure', async () => {
        const user = userEvent.setup();
        let isValid = false;

        const {rerender} = render(
            <LanguageContextProvider>
                <MultiPageForm {...props} validatePage={() => isValid} submitting={false} />
            </LanguageContextProvider>
        );

        await user.click(screen.getByText('Next'));
        // Still on first page
        expect(screen.queryByText('Back')?.getAttribute('hidden')).toBe('');
        isValid = true;
        await user.click(screen.getByText('Next'));
        await user.click(screen.getByText('Next'));
        isValid = false;
        await user.click(screen.getByText('Submit'));
        expect(submitted).toBe(true);
        rerender(
            <LanguageContextProvider>
                <MultiPageForm {...props} validatePage={() => isValid} submitting={true} />
            </LanguageContextProvider>
        );
    });
});

