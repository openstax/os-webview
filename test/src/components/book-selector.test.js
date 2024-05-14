import React from 'react';
import {render, screen} from '@testing-library/preact';
import BookSelector from '~/components/book-selector/book-selector';
import {MemoryRouter} from 'react-router-dom';
import {it, expect} from '@jest/globals';
import {LanguageContextProvider} from '~/contexts/language';

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
        <LanguageContextProvider>
            <MemoryRouter>
                <BookSelector {...props} />
            </MemoryRouter>
        </LanguageContextProvider>
    );
    const checkboxes = await screen.findAllByRole('checkbox');

    expect(checkboxes).toHaveLength(9);
});
