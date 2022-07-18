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

test('handles English title', (done) => {
    render(<WrapComponent><LetUsKnow title={englishTitle} /></WrapComponent>);
    setTimeout(() => {
        expect(screen.getByText('Using this book? Let us know.'));
        done();
    }, 20);
});
test('handles Polish title', (done) => {
    render(<WrapComponent><LetUsKnow title={polishTitle} /></WrapComponent>);

    setTimeout(() => {
        expect(screen.getByText('Korzystasz z tej książki? Daj nam znać.'));
        done();
    }, 20);
});
