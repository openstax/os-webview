import React from 'react';
import {render, screen} from '@testing-library/preact';
import LetUsKnow from '~/pages/details/common/let-us-know/let-us-know';

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';

test('handles English title', () => {
    render(<LetUsKnow title={englishTitle} />);
    expect(screen.getByText('Using this book? Let us know.'));
});
test('handles Polish title', () => {
    render(<LetUsKnow title={polishTitle} />);

    expect(screen.getByText('Korzystasz z tej książki? Daj nam znać.'));
});
