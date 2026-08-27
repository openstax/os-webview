import React from 'react';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ExploreBy from '~/components/explore-by/explore-by';

describe('explore-by', () => {
    it('renders subject cards with encoded links and optional icons', () => {
        const {container} = render(
            <MemoryRouter initialEntries={['/blog']}>
                <ExploreBy
                    items={[
                        {id: 1, name: 'Math & Science', subjectIcon: '/images/math.svg'},
                        {id: 2, name: 'Biology'}
                    ]}
                    title="Explore by subject"
                    analyticsNav="Blog Subjects"
                />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {level: 2, name: 'Explore by subject'})).toBeInTheDocument();
        expect(container.querySelector('.item-links')).toHaveAttribute('data-analytics-nav', 'Blog Subjects');
        expect(screen.getByRole('link', {name: 'Math & Science'})).toHaveAttribute(
            'href',
            '/explore/subjects/Math%20%26%20Science'
        );
        expect(screen.getByRole('link', {name: 'Biology'})).toHaveAttribute(
            'href',
            '/explore/subjects/Biology'
        );
        expect(container.querySelectorAll('img')).toHaveLength(1);
        expect(container.querySelector('img')).toHaveAttribute('src', '/images/math.svg');
    });
});
