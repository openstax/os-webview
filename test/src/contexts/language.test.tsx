import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {mockStorage} from '../../helpers/mock-localStorage';
import useLanguageContext, {LanguageContextProvider} from '~/contexts/language';

function Component({compare}: {compare: string}) {
    const {language} = useLanguageContext();

    if (language === compare) {
        return <div>ok</div>;
    }
    return (
        <div>waiting</div>
    );
}

describe('language-context', () => {
    it('sets Spanish from localStorage', async () => {
        mockStorage.getItem.mockImplementationOnce(() => 'es');
        render(
            <LanguageContextProvider>
                <Component compare='es' />
            </LanguageContextProvider>
        );
        await screen.findByText('ok');
    });
    it('defaults to English', async () => {
        mockStorage.getItem.mockImplementationOnce(() => '');
        render(
            <LanguageContextProvider>
                <Component compare='en' />
            </LanguageContextProvider>
        );
        await screen.findByText('ok');
    });
});
