import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import LoadSubject from '~/pages/subjects/new/specific/specific';
import useDebounceTest from '~/helpers/use-debounce-test';
import FindTranslation from '~/pages/subjects/new/specific/find-translation';
import LazyLoad from 'react-lazyload';
import businessBooksData from '~/../../test/src/data/business-books';

const adText = 'Instructors, take your course online';
const infoboxText = 'Expert Authors';
const aboutText = 'About Openstax textbooks'; // sic

function Component({subject = 'business'}) {
    return (
        <ShellContextProvider>
            <MemoryRouter
                basename="/subjects"
                initialEntries={[`/subjects/${subject}`]}
            >
                <Routes>
                    <Route path=":subject" element={<LoadSubject />} />
                </Routes>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

const mockUsePageData = jest.fn();

jest.mock('~/helpers/use-page-data', () => ({
    __esModule: true,
    default: () => mockUsePageData()
}));

jest.mock('~/components/promote-badge/promote-badge', () => jest.fn());
jest.mock('~/helpers/use-debounce-test', () => jest.fn(() => false));
jest.mock('~/pages/subjects/new/specific/find-translation', () => jest.fn());
jest.mock('~/components/book-tile/book-tile', () => jest.fn());
jest.mock('~/pages/subjects/new/specific/translation-selector', () =>
    jest.fn()
);
jest.mock('react-lazyload', () => jest.fn());
jest.mock('~/pages/subjects/new/specific/import-blog-posts.js', () =>
    jest.fn()
);
jest.mock('~/pages/subjects/new/specific/import-learn-more.js', () =>
    jest.fn()
);
jest.mock('~/pages/subjects/new/specific/webinars', () => jest.fn());

const mockLazyLoad = LazyLoad as jest.Mock;

describe('specific subject page', () => {
    beforeEach(() => mockUsePageData.mockReturnValue(businessBooksData));

    const user = userEvent.setup();

    it('renders something', async () => {
        render(<Component />);
        await screen.findByText('Business Book Categories');
    });
    it('handles subject not found', () => {
        render(<Component subject="notfound" />);
        expect(
            screen.queryAllByText('Categories', {exact: false})
        ).toHaveLength(0);
        expect(FindTranslation).not.toHaveBeenCalled();
    });
    it('handles subject not found after timeout', () => {
        (useDebounceTest as jest.Mock).mockReturnValueOnce(true);
        render(<Component subject="notfound" />);
        expect(
            screen.queryAllByText('Categories', {exact: false})
        ).toHaveLength(0);
        expect(FindTranslation).toHaveBeenCalled();
    });
    it('omits infoboxes, tutor ad, about OS, translations, learn-more when not supplied', async () => {
        mockLazyLoad.mockImplementation(({children}) => (
            <React.Fragment>{children}</React.Fragment>
        ));
        // Remove them from page data
        mockUsePageData.mockReturnValueOnce({
            ...businessBooksData,
            aboutOs: undefined,
            infoBoxes: undefined,
            tutorAd: undefined,
            translations: undefined,
            learnMoreAboutBooks: undefined,
            pageDescription: undefined // just substitutes empty string
        });
        render(<Component />);
        await screen.findAllByText('Open textbooks');
        expect(screen.queryAllByText(adText)).toHaveLength(0);
        expect(screen.queryAllByText(infoboxText)).toHaveLength(0);
        expect(screen.queryAllByText(aboutText)).toHaveLength(0);
    });
    it('does infoboxes, tutor ad, and about OS when present', async () => {
        mockLazyLoad.mockImplementation(({children}) => (
            <React.Fragment>{children}</React.Fragment>
        ));
        render(<Component />);
        await screen.findByText(adText);
        screen.getByText(infoboxText);
        screen.getByText(aboutText);
    });
    it('has working navigator links', async () => {
        mockLazyLoad.mockImplementation(({children}) => (
            <React.Fragment>{children}</React.Fragment>
        ));
        render(<Component />);
        const [accountingLink, ...links] =
            await screen.findAllByRole<HTMLAnchorElement>('link');

        expect(links).toHaveLength(9);
        await user.click(accountingLink);
        // This is just a scroll action; no test
    });
});
