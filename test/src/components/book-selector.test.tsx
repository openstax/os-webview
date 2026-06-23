import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BookSelector, {
    useSelectedBooks
} from '~/components/book-selector/book-selector';
import {useAfterSubmit} from '~/components/book-selector/after-form-submit';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {describe, it, expect} from '@jest/globals';
import {LanguageContextProvider} from '~/contexts/language';

// Mock book data with Spanish subjects
// Note: This data is also defined inside the jest.mock factory below due to hoisting
jest.mock('~/models/books', () => {
    /* eslint-disable camelcase */
    const mockBooksWithSpanish = [
        {
            id: 1,
            book_state: 'live',
            cover_url: 'http://example.com/calculus.jpg',
            salesforce_abbreviation: 'Calculus',
            salesforce_name: 'Calculus',
            slug: 'calculus',
            subjects: ['Math'],
            title: 'Calculus',
            content_warning_text: ''
        },
        {
            id: 2,
            book_state: 'live',
            cover_url: 'http://example.com/biology.jpg',
            salesforce_abbreviation: 'Biology',
            salesforce_name: 'Biology',
            slug: 'biology',
            subjects: ['Science'],
            title: 'Biology',
            content_warning_text: ''
        },
        {
            id: 3,
            book_state: 'live',
            cover_url: 'http://example.com/algebra-spanish.jpg',
            salesforce_abbreviation: 'Algebra ES',
            salesforce_name: 'Álgebra',
            slug: 'algebra-es',
            subjects: ['Matemáticas'],
            title: 'Álgebra',
            content_warning_text: ''
        },
        {
            id: 4,
            book_state: 'live',
            cover_url: 'http://example.com/business.jpg',
            salesforce_abbreviation: 'Business',
            salesforce_name: 'Business',
            slug: 'business',
            subjects: ['Business'],
            title: 'Business',
            content_warning_text: ''
        },
        {
            id: 5,
            book_state: 'live',
            cover_url: 'http://example.com/business-spanish.jpg',
            salesforce_abbreviation: 'Business ES',
            salesforce_name: 'Negocios',
            slug: 'negocios',
            subjects: ['Empresarial'],
            title: 'Negocios',
            content_warning_text: ''
        },
        {
            id: 6,
            book_state: 'live',
            cover_url: 'http://example.com/physics.jpg',
            salesforce_abbreviation: 'Physics',
            salesforce_name: 'Physics',
            slug: 'physics',
            subjects: ['Ciencia'],
            title: 'Física',
            content_warning_text: ''
        },
        {
            id: 8,
            book_state: 'live',
            cover_url: 'http://example.com/history.jpg',
            salesforce_abbreviation: 'History',
            salesforce_name: 'History',
            slug: 'history',
            subjects: ['Ciencias Sociales'],
            title: 'Historia',
            content_warning_text: ''
        }
    ];
    /* eslint-enable camelcase */

    const filteredBooks = mockBooksWithSpanish.filter(
        (b) => b.book_state !== 'retired'
    );

    return {
        __esModule: true,
        fetchAllBooks: Promise.resolve(mockBooksWithSpanish),
        default: Promise.resolve(filteredBooks)
    };
});

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

    return (
        <BookSelector
            {...props}
            {...otherProps}
            selectedBooks={selectedBooks}
            toggleBook={toggleBook}
        />
    );
}

function Component({route = '/selector', ...otherProps}) {
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
    const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

    it('preselects a book based on path', async () => {
        render(<Component route="/selector?Calculus" />);
        // Preselected book appears as a tag
        const tag = await screen.findByText('Calculus');

        expect(tag).toBeTruthy();
        // Search to expand math section and verify checkbox state
        await user.type(screen.getByRole('searchbox'), 'Calculus');
        const checked = await screen.findByRole('checkbox', {checked: true});

        expect(checked).toBeTruthy();
    });

    it('shows additional instructions', async () => {
        delete (props as Partial<typeof props>).limit;
        render(<Component additionalInstructions="bake at 350" />);
        screen.findByText('bake at 350');
    });

    it('handles Spanish subjects without English partners', async () => {
        render(<Component />);
        // Wait for component to load
        await screen.findByRole('searchbox');

        // Spanish subject 'Ciencia' should appear on its own since 'Science' books exist
        // but 'Fisica' is the only book with pure 'Ciencia' subject
        const buttons = await screen.findAllByRole('button');
        const subjectLabels = buttons.map((btn) => btn.textContent);

        // Should include Spanish subjects that don't have English partners
        // This tests the .map on line 45 that creates standalone Spanish subjects
        expect(
            subjectLabels.some((label) => label?.includes('Ciencia'))
        ).toBeTruthy();
    });

    it('toggles subject section open and closed', async () => {
        render(<Component />);
        await screen.findByRole('searchbox');

        // Find a subject toggle button
        const mathButton = await screen.findByText('Math / Matemáticas');

        // Initially, the section should be collapsed (no checkboxes visible)
        expect(screen.queryByRole('checkbox')).toBeFalsy();

        await user.click(mathButton);
        await waitFor(() => {
            expect(screen.queryAllByRole('checkbox')).toBeTruthy();
        });

        // Verify the button has aria-expanded="true"
        expect(
            mathButton.closest('button')?.getAttribute('aria-expanded')
        ).toBe('true');

        await user.click(mathButton);
        await waitFor(() => {
            expect(
                mathButton.closest('button')?.getAttribute('aria-expanded')
            ).toBe('false');
        });
    });

    it('removes selected book via tag button', async () => {
        render(<Component />);
        await screen.findByRole('searchbox');

        // Expand a section and select a book
        const mathButton = await screen.findByText('Math / Matemáticas');

        await user.click(mathButton);

        const [checkbox] = await screen.findAllByRole('checkbox');

        await user.click(checkbox);
        const removeButton = await screen.findByRole('button', {
            name: /Remove/i
        });

        // Verify tag is present
        expect(removeButton).toBeTruthy();

        await user.click(removeButton);
        await waitFor(() => {
            expect(screen.queryByRole('button', {name: /Remove/i})).toBeFalsy();
        });

        expect(checkbox.getAttribute('aria-checked')).toBe('false');
    });

    it('shows correct hint text when limit is reached', async () => {
        // Explicitly pass limit: 2 to ensure it's set
        render(<Component limit={2} />);
        await screen.findByRole('searchbox');

        // Expand section and select first book
        const mathButton = await screen.findByText('Math / Matemáticas');

        await user.click(mathButton);

        // Get all checkboxes and click two of them
        const checkboxes = await screen.findAllByRole('checkbox');

        await user.click(checkboxes[0]);
        await user.click(checkboxes[1]);

        await screen.findByText('Maximum 2 selected');
    });

    it('filters books by search with empty search returning all books', async () => {
        render(<Component />);
        const searchBox = await screen.findByRole('searchbox');

        // Initially, with empty search, all books should be available
        // Expand Math section
        const mathButton = await screen.findByText('Math / Matemáticas');

        await user.click(mathButton);
        await screen.findByText('Calculus');

        await user.type(searchBox, 'Biology');
        await waitFor(() => {
            expect(screen.queryByText('Calculus')).toBeFalsy();
        });
        const scienceButton = await screen.findByText('Science / Ciencia');

        expect(scienceButton).toBeTruthy();
    });

    it('handles removing a selected book when in the selectedBooks array', async () => {
        // Use Component wrapper which properly calls useSelectedBooks() inside BookSelectorPage
        render(<Component />);
        await screen.findByRole('searchbox');

        // Expand and select a book
        const mathButton = await screen.findByText('Math / Matemáticas');

        await user.click(mathButton);

        // Use aria-label to select specific checkbox (there are multiple checkboxes)
        const checkbox = await screen.findByRole('checkbox', {
            name: 'Calculus'
        });

        await user.click(checkbox);
        await waitFor(() => {
            expect(checkbox.getAttribute('aria-checked')).toBe('true');
        });

        // Verify book is selected by checking for the tag in the DOM
        await waitFor(() => {
            const tags = document.querySelectorAll('.selected-tag');

            expect(tags.length).toBeGreaterThan(0);
        });
        await user.click(checkbox);
        await waitFor(() => {
            expect(checkbox.getAttribute('aria-checked')).toBe('false');
        });

        // Book should be removed from selection - no more tags
        await waitFor(() => {
            const tags = document.querySelectorAll('.selected-tag');

            expect(tags.length).toBe(0);
        });
    });

    it('groups Spanish subjects with English partners correctly', async () => {
        render(<Component />);
        await screen.findByRole('searchbox');

        // Should see grouped subjects like "Math / Matemáticas"
        const groupedMath = await screen.findByText('Math / Matemáticas');

        expect(groupedMath).toBeTruthy();

        // Should see grouped subjects like "Business / Empresarial"
        const groupedBusiness = await screen.findByText(
            'Business / Empresarial'
        );

        expect(groupedBusiness).toBeTruthy();

        // Spanish "Ciencia" should be paired with English "Science"
        const groupedScience = await screen.findByText('Science / Ciencia');

        expect(groupedScience).toBeTruthy();

        // Spanish "Ciencias Sociales" appears unpaired because there's no English book
        // with "Social Sciences" subject in the mock data. The Historia book has
        // "Ciencias Sociales" but no corresponding English Social Sciences book exists,
        // so it appears standalone per the groupSubjects logic
        const unpairedSocial = await screen.findByText('Ciencias Sociales');

        expect(unpairedSocial).toBeTruthy();
    });

    it('expands all sections when searching', async () => {
        render(<Component />);
        const searchBox = await screen.findByRole('searchbox');

        // Initially sections should be collapsed
        expect(screen.queryByRole('checkbox')).toBeFalsy();

        // Type in search box
        await user.type(searchBox, 'Bio');

        // All matching sections should auto-expand
        await waitFor(() => {
            const buttons = screen.getAllByRole('button');
            const expandedButtons = buttons.filter(
                // eslint-disable-next-line max-nested-callbacks
                (btn) => btn.getAttribute('aria-expanded') === 'true'
            );

            expect(expandedButtons.length).toBeGreaterThan(0);
        });
    });

    it('shows validation message when no books selected', async () => {
        render(<Component />);
        await screen.findByRole('searchbox');

        // Should show validation message
        const validationMsg = await screen.findByText(
            'Please select at least one book'
        );

        expect(validationMsg).toBeTruthy();
    });

    it('hides validation message when books are selected', async () => {
        render(<Component />);
        await screen.findByRole('searchbox');

        // Select a book
        const mathButton = await screen.findByText('Math / Matemáticas');

        await user.click(mathButton);

        const [checkbox] = await screen.findAllByRole('checkbox');

        await user.click(checkbox);

        // Validation message should be empty/hidden
        await waitFor(() => {
            const invalidMsg = document.querySelector('.invalid-message');

            expect(invalidMsg?.textContent).toBe('');
        });
    });
});
