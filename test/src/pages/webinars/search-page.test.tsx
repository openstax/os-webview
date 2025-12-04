import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import SearchPage from '~/pages/webinars/search-page/search-page';
import * as UFD from '~/helpers/use-data';
import {upcomingWebinar} from '../../data/webinars';
import * as UWC from '~/pages/webinars/webinar-context';

function Component({term = ''}: {term?: string}) {
    return (
        <MemoryRouter initialEntries={[`/webinars/search?q=${term}`]}>
            <SearchPage />
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

jest.mock('~/helpers/use-data', () => jest.fn());
const mockUseFetchedData = jest.spyOn(UFD, 'default');

describe('webinar search page', () => {
    it('short circuits while waiting for webinars to return', () => {
        mockUseFetchedData.mockReturnValue(undefined);
        render(<Component term='waiting' />);

        expect(screen.queryByText('matching')).toBeNull();
    });
    it('displays a message when search returns no results', () => {
        mockUseFetchedData.mockReturnValue([]);
        render(<Component term='xnotfoundx' />);

        expect(screen.getByText('No matching webinars found')).toBeTruthy();
    });
    it('displays results when they are returned', () => {
        // For code coverage
        mockUseFetchedData.mockImplementation(({postProcess}) => {
            postProcess?.(upcomingWebinar);
            return [upcomingWebinar];
        });
        render(<Component term='something' />);

        expect(screen.queryByText('No matching webinars found')).toBeNull();
    });
});
