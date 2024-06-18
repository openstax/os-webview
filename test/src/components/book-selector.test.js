import React from 'react';
import {render, screen} from '@testing-library/preact';
import BookSelector, {
    useSelectedBooks
} from '~/components/book-selector/book-selector';
import {useAfterSubmit} from '~/components/book-selector/after-form-submit';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect} from '@jest/globals';
import {LanguageContextProvider} from '~/contexts/language';

const props = {
    prompt: 'Which textbook(s) are you currently using?',
    required: true
};

function BookSelectorPage() {
    const [selectedBooks, toggleBook] = useSelectedBooks();
    const selectedBooksRef = React.useRef(selectedBooks);
    const afterSubmit = useAfterSubmit(selectedBooksRef);

    selectedBooksRef.current = selectedBooks;
    if (selectedBooks.length > 0) {
        afterSubmit();
    }

    return <BookSelector {...props} selectedBooks={selectedBooks} toggleBook={toggleBook} />;
}

describe('book-selector', () => {
    it('preselects a book based on path', async () => {
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['/selector?Calculus']}>
                    <BookSelectorPage />
                </MemoryRouter>
            </LanguageContextProvider>
        );
        const checkboxes = await screen.findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(9);
        const checked = await screen.findByRole('checkbox', {checked: true});

        expect(checked).toBeTruthy();
    });
});
