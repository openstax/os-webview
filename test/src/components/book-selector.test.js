import React from 'react';
import {render, screen} from '@testing-library/preact';
import BookSelector from '~/components/book-selector/book-selector';

const props = {
    prompt: 'Which textbook(s) are you currently using?',
    required: true,
    preselectedTitle: 'College Physics',
    selectedBooks: [],
    toggleBook(book) {
        console.log('Toggled', book);
    }
};

it ('lists the books', (done) => {
    render(<BookSelector {...props} />);
    setTimeout(() => {
        expect(screen.getAllByRole('checkbox')).toHaveLength(24);
        done();
    }, 20);
});
