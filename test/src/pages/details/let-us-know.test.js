import React from 'react';
import BookDetailsContextProvider from './book-details-context';
import LetUsKnow from '~/pages/details/common/let-us-know/let-us-know';
import {render, screen} from '@testing-library/preact';

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';

test('handles English title', async () => {
    render(
        <BookDetailsContextProvider>
            <LetUsKnow title={englishTitle} />
        </BookDetailsContextProvider>
    );
    await screen.findByText('Using this book? Let us know.');
});
test('handles Polish title', async () => {
    render(
        <BookDetailsContextProvider>
            <LetUsKnow title={polishTitle} />
        </BookDetailsContextProvider>
    );
    await screen.findByText('Korzystasz z tej książki? Daj nam znać.');
});
