import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Breadcrumb, {RetraceableLink} from '~/components/breadcrumb/breadcrumb';

function Component({name}: {name: string}) {
    return (
        <MemoryRouter initialEntries={['/first', '/second', '/third']}>
            <Breadcrumb name={name} />
            <RetraceableLink
                className='btn primary'
                to='/third'
                data-analytics-link='webinars_upcoming'
            >
                View all upcoming webinars
            </RetraceableLink>
        </MemoryRouter>
    );
}

// There's not much functionality to inspect, but you should have 100% code coverage
describe('breadcrumb', () => {
    it('navigates to new and retraceable links', async () => {
        render(<Component name="fourth" />);

        const user = userEvent.setup();

        await user.click(screen.getAllByRole('link')[0]);
        await user.click(screen.getAllByRole('link')[1]);
        await user.click(screen.getAllByRole('link')[0]);
    });
});
