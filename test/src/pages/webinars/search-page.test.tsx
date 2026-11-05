import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import SearchPage from '~/pages/webinars/search-page/search-page';
import * as UFD from '~/helpers/use-data';
import {upcomingWebinar} from '../../data/webinars';
import * as UWC from '~/pages/webinars/webinar-context';
import ShellContextProvider from '~/../../test/helpers/shell-context';

function Component({path}: {path: string}) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <ShellContextProvider>
                <SearchPage />
            </ShellContextProvider>
        </MemoryRouter>
    );
}

jest.spyOn(UWC, 'default').mockReturnValue({
    pageData: {},
    past: [],
    upcoming: [],
    subjects: [],
    collections: [],
    searchFor: jest.fn(),
    latestWebinars: []
});

// Only the default export is mocked; the shell's shared data context uses usePromise
jest.mock('~/helpers/use-data', () => ({
    ...jest.requireActual('~/helpers/use-data'),
    __esModule: true,
    default: jest.fn()
}));
const mockUseFetchedData = jest.spyOn(UFD, 'default');

describe('webinar search page', () => {
    beforeEach(() => {
        mockUseFetchedData.mockClear();
    });

    it('short circuits while waiting for webinars to return', () => {
        mockUseFetchedData.mockReturnValue(undefined);
        render(<Component path='/webinars/search?q=waiting' />);

        expect(screen.queryByText('matching')).toBeNull();
    });
    it('displays a message when search returns no results', () => {
        mockUseFetchedData.mockReturnValue([]);
        render(<Component path='/webinars/search?q=xnotfoundx' />);

        expect(screen.getByText('No matching webinars found')).toBeTruthy();
    });
    it('displays results when they are returned', () => {
        // For code coverage
        mockUseFetchedData.mockImplementation(({postProcess}) => {
            postProcess?.(upcomingWebinar);
            return [upcomingWebinar];
        });
        render(<Component path='/webinars/search?q=something' />);

        expect(screen.queryByText('No matching webinars found')).toBeNull();
    });
    it('requests webinars without sort param when sort=relevance (default)', () => {
        mockUseFetchedData.mockReturnValue([]);
        render(<Component path='/webinars/search?q=test' />);

        expect(mockUseFetchedData).toHaveBeenCalledWith(
            expect.objectContaining({
                slug: 'webinars/search?q=test'
            }),
            undefined
        );
    });
    it('requests webinars with sort=newest param when specified in URL', () => {
        mockUseFetchedData.mockReturnValue([]);
        render(<Component path='/webinars/search?q=test&sort=newest' />);

        expect(mockUseFetchedData).toHaveBeenCalledWith(
            expect.objectContaining({
                slug: 'webinars/search?q=test&sort=newest'
            }),
            undefined
        );
    });
});
