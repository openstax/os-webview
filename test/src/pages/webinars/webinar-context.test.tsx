import React from 'react';
import {describe, it} from '@jest/globals';
import {render} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import useWebinarContext, {WebinarContextProvider} from '~/pages/webinars/webinar-context';
import useData from '~/helpers/use-data';
import {upcomingWebinar} from '../../data/webinars';

function Component() {
    return (
        <MemoryRouter basename='/webinars' initialEntries={['/webinars']}>
            <WebinarContextProvider>
                <UserComponent />
            </WebinarContextProvider>
        </MemoryRouter>
    );
}

function UserComponent() {
    const {searchFor} = useWebinarContext();

    React.useEffect(() => searchFor('something'), [searchFor]);

    return null;
}

jest.mock('~/helpers/use-data', () => jest.fn());

describe('webinar context', () => {
    it('provides context with a searchFor function', () => {
        (useData as jest.Mock).mockImplementation((props) => {
            if (props.slug.startsWith('webinars')) {
                props.postProcess(upcomingWebinar);
                return Array(3).fill(upcomingWebinar);
            }
            return [];
        });
        render(<Component />);
        expect(useData as jest.Mock).toHaveBeenCalledTimes(12);
    });
});
