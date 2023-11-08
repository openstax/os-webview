import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import {RouterContextProvider} from '~/components/shell/router-context';
import SearchPage from '~/pages/webinars/search-page/search-page';
import useFetchedData from '~/helpers/use-data';
import {upcomingWebinar} from '../../data/webinars';

function Component({term = ''}: {term?: string}) {
    return (
        <MemoryRouter initialEntries={[`/webinars/search?q=${term}`]}>
            <RouterContextProvider>
                <SearchPage />
            </RouterContextProvider>
        </MemoryRouter>
    );
}

jest.mock('~/helpers/use-data', () => jest.fn());

describe('webinar search page', () => {
    it('short circuits while waiting for webinars to return', () => {
        (useFetchedData as jest.Mock).mockReturnValue(undefined);
        render(<Component term='waiting' />);

        expect(screen.queryByText('matching')).toBeNull();
    });
    it('displays a message when search returns no results', () => {
        (useFetchedData as jest.Mock).mockReturnValue([]);
        render(<Component term='xnotfoundx' />);

        expect(screen.getByText('No matching webinars found')).toBeTruthy();
    });
    it('displays results when they are returned', () => {
        // For code coverage
        (useFetchedData as jest.Mock).mockImplementation(({postProcess}) => {
            postProcess(upcomingWebinar);
            return [upcomingWebinar];
        });
        render(<Component term='something' />);

        expect(screen.queryByText('No matching webinars found')).toBeNull();
    });
});
