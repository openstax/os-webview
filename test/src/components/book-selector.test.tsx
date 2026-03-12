import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import BookSelector, {
    useSelectedBooks
} from '~/components/book-selector/book-selector';
import {useAfterSubmit} from '~/components/book-selector/after-form-submit';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {describe, it, expect} from '@jest/globals';
import {LanguageContextProvider} from '~/contexts/language';

const props = {
    prompt: 'Which textbook(s) are you currently using?',
    required: true,
    name: 'Testbook',
    limit: 2
};

function BookSelectorPage({...otherProps}) {
    const [selectedBooks, toggleBook] = useSelectedBooks();
    const selectedBooksRef = React.useRef(selectedBooks);
    const afterSubmit = useAfterSubmit(selectedBooksRef);

    selectedBooksRef.current = selectedBooks;
    if (selectedBooks.length > 0) {
        afterSubmit();
    }

    return <BookSelector {...props} {...otherProps} selectedBooks={selectedBooks} toggleBook={toggleBook} />;
}

function Component({route='/selector', ...otherProps}) {
    return (
        <LanguageContextProvider>
            <MemoryRouter initialEntries={[route]}>
                <BookSelectorPage {...otherProps} />
            </MemoryRouter>
        </LanguageContextProvider>
    );
}

describe('book-selector', () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    it('preselects a book based on path', async () => {
        render(<Component route='/selector?Calculus' />);
        const checked = await screen.findByRole('checkbox', {checked: true});

        expect(checked).toBeTruthy();
        // The math section is open because Calculus is preselected
        const unchecked = screen.getAllByRole('checkbox', {checked: false});

        await user.click(unchecked[0]);
        const nowChecked = screen.getAllByRole('checkbox', {checked: true});

        expect(nowChecked).toHaveLength(2);
        await user.click(nowChecked[1]);
    });
    it('shows additional instructions', async () => {
        delete (props as Partial<typeof props>).limit;
        render(<Component additionalInstructions='bake at 350' />);
        screen.findByText('bake at 350');
    });
});
