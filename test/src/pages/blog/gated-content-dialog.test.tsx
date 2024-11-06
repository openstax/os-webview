import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/preact';
import {describe, it, expect} from '@jest/globals';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {MainClassContextProvider} from '~/contexts/main-class';
import {BlogContextProvider} from '~/pages/blog/blog-context';
import {MemoryRouter} from 'react-router-dom';
import GatedContentDialog from '~/pages/blog/gated-content-dialog/gated-content-dialog';
import type {ArticleData} from '~/pages/blog/article/article';
import userEvent from '@testing-library/user-event';

const articleData: ArticleData = {
    gatedContent: true,
    heading: 'heading',
    subheading: 'subhead',
    date: 'a date',
    author: 'author',
    body: [],
    featuredVideo: [{value: ''}],
    articleImage: 'article-image',
    featuredImageAltText: 'alt text',
    tags: []
};

const mockUseDialog = jest.fn();
const mockOpen = jest.fn();
const mockClose = jest.fn();
const mockUseUserContext = jest.fn();
const userData = {
    userModel: {
        id: 123,
        instructorEligible: false
    }
};
const mockUseFormTarget = jest.fn();

jest.mock('~/components/dialog/dialog', () => ({
    ...jest.requireActual('~/components/dialog/dialog'),
    useDialog: () => mockUseDialog()
}));

jest.mock('~/contexts/user', () => ({
    ...jest.requireActual('~/contexts/user'),
    __esModule: true,
    default: () => mockUseUserContext()
}));

mockUseUserContext.mockReturnValue(userData);

jest.mock('~/components/form-target/form-target', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockUseFormTarget(...args)
}));

mockUseFormTarget.mockImplementation((fn) => {
    return {
        onSubmit: (e: Event) => {
            e.preventDefault();
            fn();
        },
        FormTarget: () => <div className="form-target" />
    };
});

function Component({path}: {path: string}) {
    return (
        <MemoryRouter basename="/blog" initialEntries={[path]}>
            <ShellContextProvider>
                <MainClassContextProvider>
                    <BlogContextProvider>
                        <GatedContentDialog articleData={articleData} />
                    </BlogContextProvider>
                </MainClassContextProvider>
            </ShellContextProvider>
        </MemoryRouter>
    );
}

mockUseDialog.mockReturnValue([
    ({children}: React.PropsWithChildren<Record<string, never>>) => (
        <div>{children}</div>
    ),
    mockOpen,
    mockClose
]);

describe('blog/gated-content-dialog', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        mockOpen.mockReset();
        mockClose.mockReset();
    });

    it('displays when gatedContent is set in article data', async () => {
        render(<Component path="/blog/some-post" />);

        expect(await screen.findAllByText('Please select one')).toHaveLength(4);
        expect(mockOpen).not.toHaveBeenCalled();
        const comboBoxes = screen.getAllByRole('combobox');

        // Make selection in Subjects combobox
        expect(comboBoxes).toHaveLength(2);
        await user.click(comboBoxes[0]);
        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(5);

        await user.click(options[1]);
        // Select Faculty role
        await user.click(comboBoxes[1]);
        const facultyOption = screen
            .getAllByRole('option')
            .find((o) => o.textContent === 'Instructor');

        await user.click(facultyOption as Element);
        // Fill in other fields
        const fields = screen.getAllByRole('textbox');

        fields.forEach((i) =>
            fireEvent.change(i, {target: {value: 'something'}})
        );

        // Click submit
        await user.click(screen.getByRole('button'));
    });
    it('calls open when there is no user id', async () => {
        mockUseUserContext.mockReturnValue({});

        render(<Component path="/blog/some-post" />);
        await waitFor(() => expect(mockOpen).toHaveBeenCalled());
        expect(mockClose).not.toHaveBeenCalled();
        mockUseUserContext.mockClear();
    });
});
