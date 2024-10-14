import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import LoadSubject from '~/pages/subjects/new/specific/specific';
import useSpecificSubjectContext from '~/pages/subjects/new/specific/context';
import useDebounceTest from '~/helpers/use-debounce-test';
import FindTranslation from '~/pages/subjects/new/specific/find-translation';
import {
    mathSubjectContext,
    tutorAd,
    infoBoxes,
    aboutOs
} from '../../data/specific-subject';
import LazyLoad from 'react-lazyload';

function Component({subject = 'math'}) {
    return (
        <ShellContextProvider>
            <MemoryRouter
                basename='/subjects'
                initialEntries={[`/subjects/${subject}`]}
            >
                <Routes>
                    <Route path=':subject' element={<LoadSubject />} />
                </Routes>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

const mathCategories = {
    value: 'math',
    cms: 'math',
    html: 'Math',
    title: 'math',
    icon: 'image',
    color: 'red'
};

jest.mock('~/contexts/subject-category', () => jest.fn(() => [mathCategories]));
jest.mock('~/pages/subjects/new/specific/context', () =>
    jest.fn(() => ({categories: []}))
);
jest.mock('~/components/promote-badge/promote-badge', () => jest.fn());
jest.mock('~/helpers/use-debounce-test', () => jest.fn(() => false));
jest.mock('~/pages/subjects/new/specific/find-translation', () => jest.fn());
jest.mock('~/pages/subjects/new/specific/navigator', () => jest.fn());
jest.mock('~/pages/subjects/new/specific/book-viewer', () => jest.fn());
jest.mock('~/pages/subjects/new/specific/translation-selector', () =>
    jest.fn()
);
jest.mock('react-lazyload', () => jest.fn());
jest.mock('~/pages/subjects/new/specific/import-blog-posts.js', () => jest.fn());
jest.mock('~/pages/subjects/new/specific/learn-more.js', () => jest.fn());

describe('specific subject page', () => {
    it('renders something', () => {
        render(<Component />);
        expect(screen.queryAllByText('Open textbooks')).toHaveLength(1);
        expect(screen.queryAllByText('Math')).toHaveLength(1);
    });
    it('handles subject not found', () => {
        render(<Component subject='notfound' />);
        expect(
            screen.queryAllByText('Categories', {exact: false})
        ).toHaveLength(0);
        expect(FindTranslation).not.toHaveBeenCalled();
    });
    it('handles subject not found after timeout', () => {
        (useDebounceTest as jest.Mock).mockReturnValueOnce(true);
        render(<Component subject='notfound' />);
        expect(
            screen.queryAllByText('Categories', {exact: false})
        ).toHaveLength(0);
        expect(FindTranslation).toHaveBeenCalled();
    });
    it('omits infoboxes, tutor ad, about OS when not supplied', () => {
        (LazyLoad as jest.Mock).mockImplementation(({children}) => (
            <React.Fragment>{children}</React.Fragment>
        ));
        (useSpecificSubjectContext as jest.Mock).mockReturnValue(
            mathSubjectContext
        );
        render(<Component />);
        expect(screen.queryAllByText('Open textbooks')).toHaveLength(1);
        expect(screen.queryAllByText(tutorAd.content.heading)).toHaveLength(0);
        expect(screen.queryAllByText(infoBoxes[0][0].heading)).toHaveLength(0);
        expect(screen.queryAllByText(aboutOs.content.heading)).toHaveLength(0);
    });
    it('does infoboxes, tutor ad, and about OS when present', () => {
        (LazyLoad as jest.Mock).mockImplementation(({children}) => (
            <React.Fragment>{children}</React.Fragment>
        ));
        (useSpecificSubjectContext as jest.Mock).mockReturnValue({
            ...mathSubjectContext,
            tutorAd,
            infoBoxes,
            aboutOs
        });
        render(<Component />);
        expect(screen.queryAllByText(tutorAd.content.heading)).toHaveLength(1);
        expect(screen.queryAllByText(infoBoxes[0][0].heading)).toHaveLength(1);
        expect(screen.queryAllByText(aboutOs.content.heading)).toHaveLength(1);
    });
});
