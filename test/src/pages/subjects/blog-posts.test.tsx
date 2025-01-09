import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import MaybeBlogPosts from '~/pages/subjects/new/specific/blog-posts';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import { SpecificSubjectContextProvider } from '~/pages/subjects/new/specific/context';
import businessBooksData from '~/../../test/src/data/business-books';
import businessBlogBlurbs from '~/../../test/src/data/business-blog-blurbs';
import * as DH from '~/helpers/use-document-head';

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
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

const mockCarouselSection = jest.fn();

jest.mock('~/pages/subjects/new/specific/components/carousel-section', () => ({
    __esModule: true,
    CarouselSection: () => mockCarouselSection()
}));

function Component() {
    return (
        <ShellContextProvider>
            <SpecificSubjectContextProvider contextValueParameters="business">
                <MaybeBlogPosts />
            </SpecificSubjectContextProvider>
        </ShellContextProvider>
    );
}

describe('subjects/blog-posts section', () => {
    it('returns null if context is empty', () => {
        mockUsePageData.mockReturnValue(undefined);
        mockUseDataFromSlug.mockReturnValue(undefined);
        const {container} = render(<Component />);

        expect(container.innerHTML).toBe('');
    });
    it('returns blog posts', async () => {
        mockUsePageData.mockReturnValue(businessBooksData);
        mockUseDataFromSlug.mockReturnValue(businessBlogBlurbs);
        mockCarouselSection.mockImplementation(({children}) => (
            <div id="carousel-section">
                {children}
            </div>
        ));
        render(<Component />);
        await screen.findByText('Meet our student blogger Kharl');
    });
    it('returns no-blogs message if none found', async () => {
        const dataNoSubject = {...businessBooksData};
        const saveWarn = console.warn;

        console.warn = jest.fn();
        dataNoSubject.title = '';
        mockUsePageData.mockReturnValue(dataNoSubject);
        mockUseDataFromSlug.mockReturnValue(undefined);
        render(<Component />);
        await screen.findByText('No blog entries found (yet)');
        expect(console.warn).toHaveBeenCalledWith('Specific subjects and title need to be defined');
        console.warn = saveWarn;
    });
});
