import React from 'react';
import {render, screen} from '@testing-library/preact';
import BookSelector from '~/components/book-selector/book-selector';
import {MemoryRouter} from 'react-router-dom';
import {it, expect} from '@jest/globals';

const props = {
    prompt: 'Which textbook(s) are you currently using?',
    required: true,
    preselectedTitle: 'College Physics',
    selectedBooks: [],
    toggleBook(book) {
        console.log('Toggled', book);
    }
};

it('lists the books', async () => {
    render(
        <MemoryRouter>
            <BookSelector {...props} />
        </MemoryRouter>
    );
    const checkboxes = await screen.findAllByRole('checkbox');

    expect(checkboxes).toHaveLength(9);
});
