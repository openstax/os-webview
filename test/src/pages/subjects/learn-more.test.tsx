import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {SpecificSubjectContextProvider} from '~/pages/subjects/new/specific/context';
import LearnMore from '~/pages/subjects/new/specific/learn-more';
import businessBooksData from '~/../../test/src/data/business-books';
import businessBlogBlurbs from '~/../../test/src/data/business-blog-blurbs';

const mockUsePageData = jest.fn();
const mockUseDataFromSlug = jest.fn();

jest.mock('~/helpers/use-page-data', () => ({
    __esModule: true,
    default: () => mockUsePageData()
}));
jest.mock('~/helpers/page-data-utils', () => ({
    __esModule: true,
    ...jest.requireActual('~/helpers/page-data-utils'),
    useDataFromSlug: () => mockUseDataFromSlug()
}));

function Component() {
    return (
        <ShellContextProvider>
            <SpecificSubjectContextProvider contextValueParameters="business">
                <LearnMore />
            </SpecificSubjectContextProvider>
        </ShellContextProvider>
    );
}

describe('subjects/learn-more section', () => {
    it('returns null if context is empty', () => {
        mockUsePageData.mockReturnValue(undefined);
        mockUseDataFromSlug.mockReturnValue(undefined);
        const {container} = render(<Component />);

        expect(container.innerHTML).toBe('');
    });
    it('renders the section', async () => {
        mockUsePageData.mockReturnValue(businessBooksData);
        mockUseDataFromSlug.mockReturnValue(businessBlogBlurbs);

        render(<Component />);
        await screen.findByText('Learn more about OpenStax Business textbooks');
    });
});
