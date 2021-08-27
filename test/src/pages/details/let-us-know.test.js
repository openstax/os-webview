import React from 'react';
import {render, screen} from '@testing-library/preact';
import {DetailsContextProvider} from '~/pages/details/context';
import LetUsKnow from '~/pages/details/common/let-us-know/let-us-know';

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';

delete window.location;
window.location = {
    pathname: '/details/books/college-algebra'
};

test('handles English title', (done) => {
    render(<DetailsContextProvider><LetUsKnow title={englishTitle} /></DetailsContextProvider>);
    setTimeout(() => {
        expect(screen.getByText('Using this book? Let us know.'));
        done();
    }, 0);
});
test('handles Polish title', (done) => {
    render(<DetailsContextProvider><LetUsKnow title={polishTitle} /></DetailsContextProvider>);

    setTimeout(() => {
        expect(screen.getByText('Korzystasz z tej książki? Daj nam znać.'));
        done();
    }, 0);
});
