import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import ExplorePage from '~/pages/webinars/explore-page/explore-page';
import useWebinarContext from '~/pages/webinars/webinar-context';
import {pastWebinar} from '../../data/webinars';
import type {Webinar} from '~/pages/webinars/types';

function Component({path}: {path: string}) {
    return (
        <MemoryRouter basename='/webinars' initialEntries={[path]}>
            <Routes>
                <Route
                    path='explore/:exploreType/:topic'
                    element={<ExplorePage />}
                />
            </Routes>
        </MemoryRouter>
    );
}

jest.mock('~/pages/webinars/webinar-context', () => jest.fn());

const webinars: Webinar[] = [0, 1, 2, 3, 4]
    .map(() => JSON.parse(JSON.stringify(pastWebinar)))
    .map((w) => {
        w.start = new Date(w.start);
        return w;
    });

webinars[1].subjects.push({
    subject: 'asubject',
    featured: 'True'
});
webinars[2].subjects.push({
    subject: 'asubject',
    featured: 'False'
});
webinars[3].collections.push({
    collection: 'asubject',
    popular: 'True',
    featured: 'False'
});
webinars[4].subjects.push({
    subject: 'bsubject',
    featured: 'False'
});

describe('webinars explore page', () => {
    (useWebinarContext as jest.Mock).mockImplementation(() => {
        return {
            latestWebinars: webinars,
            searchFor: () => null,
            subjects: [
                {
                    name: 'asubject'
                },
                {
                    name: 'bsubject',
                    subjectIcon: 'http://example.org/icon'
                }
            ],
            collections: ['asubject']
        };
    });
    it('renders a page to explore subjects', () => {
        render(<Component path='/webinars/explore/subjects/asubject' />);
        expect(screen.getAllByText('Back to Main Webinars page')).toHaveLength(
            1
        );
        expect(screen.getAllByText('Featured webinar')).toHaveLength(1);
        expect(screen.queryAllByText('Popular')).toHaveLength(0);
        expect(screen.getAllByText('OpenStax asubject webinars')).toHaveLength(
            2
        );
        expect(screen.getAllByText('Showing all 2 webinars')).toHaveLength(1);
    });
    it('includes subjectIcon', () => {
        const {container} = render(
            <Component path='/webinars/explore/subjects/bsubject' />
        );

        expect(
            container.querySelector('.heading-and-searchbar h1 img')
        ).toBeTruthy();
    });
    it('renders a page to explore collections', () => {
        render(<Component path='/webinars/explore/collections/asubject' />);
        expect(screen.queryAllByText('Featured webinar')).toHaveLength(0);
        expect(screen.queryAllByText('Popular')).toHaveLength(1);
        expect(screen.getAllByText('OpenStax asubject webinars')).toHaveLength(
            2
        );
    });
    it('paginates if there are more than 9', () => {
        (useWebinarContext as jest.Mock).mockImplementation(() => {
            return {
                latestWebinars: webinars.concat(Array(15).fill(webinars[3])),
                searchFor: () => null,
                subjects: ['asubject', 'bsubject']
            };
        });
        render(<Component path='/webinars/explore/collections/asubject' />);
        expect(screen.getAllByText('Showing 1-9 of 16 webinars')).toHaveLength(
            1
        );
    });
    it('shows no results with invalid explore type', () => {
        render(<Component path='/webinars/explore/invalid/asubject' />);
        expect(screen.queryAllByText('Featured webinar')).toHaveLength(0);
        expect(
            screen.queryAllByText('No webinars associated with asubject')
        ).toHaveLength(1);
    });
});
