import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import {RouterContextProvider} from '~/components/shell/router-context';
import {upcomingWebinar} from '../../data/webinars';
import ViewWebinarsPage from '~/pages/webinars/view-webinars-page/view-webinars-page';

function Component(props: Parameters<typeof ViewWebinarsPage>[0]) {
    return (
        <MemoryRouter initialEntries={['/general/kinetic']}>
            <RouterContextProvider>
                <ViewWebinarsPage {...props} />
            </RouterContextProvider>
        </MemoryRouter>
    );
}

describe('view webinars page', () => {
    it('displays paginated webinars', () => {
        const testData = {
            webinars: Array(20).fill(upcomingWebinar),
            heading: 'Lots of them'
        };

        render(<Component {...testData} />);
        expect(screen.queryAllByText('Register today')).toHaveLength(9);
        expect(screen.queryAllByRole('button')).toHaveLength(3);
    });

    it('has no paginator on short pages', () => {
        const testData = {
            webinars: Array(5).fill(upcomingWebinar)
        };

        render(<Component {...testData} />);
        expect(screen.queryAllByText('Register today')).toHaveLength(5);
        expect(screen.queryAllByRole('button')).toHaveLength(1);
    });
});
