import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {upcomingWebinar} from '../../data/webinars';
import PaginatedWebinarGrid from '~/pages/webinars/webinar-cards/paginated-webinar-grid';

describe('paginated webinar grid', () => {
    it('displays all webinars', () => {
        const webinars = Array(20).fill(upcomingWebinar);

        render(<PaginatedWebinarGrid webinars={webinars} />);

        expect(screen.queryAllByRole('link')).toHaveLength(11);
        expect(screen.queryAllByRole('button')).toHaveLength(2);
    });
    it('has no paginator on short pages', () => {
        const webinars = Array(5).fill(upcomingWebinar);

        render(<PaginatedWebinarGrid webinars={webinars} />);

        expect(screen.queryAllByRole('link')).toHaveLength(5);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
});
