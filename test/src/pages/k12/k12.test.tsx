import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {LanguageContextProvider} from '~/contexts/language';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import K12Router from '~/pages/k12/k12';
import K12Main from '~/pages/k12/k12-main/k12-main';
import mainPageData from '../../data/k12';
import Subject from '~/pages/k12/subject/subject';
import subjectPageData from '../../data/k12-subject';
import { transformData, camelCaseKeys } from '~/helpers/page-data-utils';
import * as DH from '~/helpers/use-document-head';

jest.setTimeout(8000);
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

const processedMainData = camelCaseKeys(transformData(mainPageData));
// @ts-expect-error data could be null
const mockImportMain = jest.fn().mockReturnValue(<K12Main data={processedMainData} />);
const processedK12SubjectData = camelCaseKeys(transformData(subjectPageData));
// @ts-expect-error data could be null
const mockImportSubject = jest.fn().mockReturnValue(<Subject data={processedK12SubjectData} />);

jest.mock('~/pages/k12/import-k12-main', () => ({
    __esModule: true,
    default: () => mockImportMain()
}));
jest.mock('~/pages/k12/import-subject', () => ({
    __esModule: true,
    default: () => mockImportSubject()
}));

describe('k12 page', () => {
    const user = userEvent.setup();

    it('routes to main k12 page with no path', async () => {
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['']}>
                    <K12Router />
                </MemoryRouter>
            </LanguageContextProvider>
        );
        // Test the subject grid filters
        await screen.findByRole('link', {name: 'Algebra'});
        await user.click(screen.getByRole('radio', {name: 'Science'}));
        expect(screen.queryByRole('link', {name: 'Algebra'})).toBeNull();
        // Test the testimonial carousel
        const carouselButton2 = await screen.findByRole('radio', {name: 'carousel button 2'});

        await user.click(carouselButton2);
        expect(carouselButton2.getAttribute('aria-selected')).toBe('true');
        // Test the banner navigator -- must be last, it empties the page
        const [bannerSelect] = screen.getAllByRole('combobox');
        const saveWarn = console.warn;

        console.warn = jest.fn();

        await user.selectOptions(bannerSelect, 'Algebra');
        expect(console.warn).toHaveBeenCalledWith('No routes matched location "/k12/algebra" ');
        console.warn = saveWarn;
    });
    it('routes to specific subject with path', async () => {
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['/algebra']}>
                    <K12Router />
                </MemoryRouter>
            </LanguageContextProvider>
        );

        await screen.findAllByText('Algebra');
        // Test onClick in QuickLinks
        await user.click(screen.getByRole('link', {name: 'Instructor resources'}));
        // nothing to observe; hash navigation should happen but doesn't
        // hash address is tested separately below
    });
    it('handles specific subject with invalid hash', async () => {
        const saveWarn = console.warn;

        console.warn = jest.fn();
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['/algebra#not-here']}>
                    <K12Router />
                </MemoryRouter>
            </LanguageContextProvider>
        );

        await screen.findAllByText('Algebra');
        expect(console.warn).toHaveBeenCalledWith('Target not found', 'not-here');
        console.warn = saveWarn;
    });
    it('handles specific subject with valid hash', async () => {
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['/algebra#resources']}>
                    <K12Router />
                </MemoryRouter>
            </LanguageContextProvider>
        );

        await screen.findAllByText('Algebra');
    });
});
