import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {DetailsContextProvider} from '~/pages/details/context';
import {LanguageContextProvider} from '~/contexts/language';
import LetUsKnow from '~/pages/details/common/let-us-know/let-us-know';
import {render, screen} from '@testing-library/preact';

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';

function WrapComponent({children}) {
    return (
        <MemoryRouter initialEntries={["/details/books/college-algebra"]}>
            <LanguageContextProvider>
                <DetailsContextProvider>
                    {children}
                </DetailsContextProvider>
            </LanguageContextProvider>
        </MemoryRouter>
    );
}

test('handles English title', async () => {
    render(<WrapComponent><LetUsKnow title={englishTitle} /></WrapComponent>);
    await screen.findByText('Using this book? Let us know.');
});
test('handles Polish title', async () => {
    render(<WrapComponent><LetUsKnow title={polishTitle} /></WrapComponent>);
    await screen.findByText('Korzystasz z tej książki? Daj nam znać.');
});
