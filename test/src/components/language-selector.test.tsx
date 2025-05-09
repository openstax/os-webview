import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import * as ULC from '~/contexts/language';
import {LanguageLink} from '~/components/language-selector/language-selector';

const user = userEvent.setup();

describe('language-selector', () => {
    const language = 'es';
    const setLanguage = jest.fn();

    jest.spyOn(ULC, 'default').mockReturnValue({language, setLanguage});

    it('handles language link click', async () => {
        render(<LanguageLink locale='en' slug='/whatever' />);

        await user.click(screen.getByRole('link'));
        expect(setLanguage).toHaveBeenCalledWith('en');
    });
});
