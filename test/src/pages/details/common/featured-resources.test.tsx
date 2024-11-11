import React from 'react';
import {render, screen} from '@testing-library/preact';
import FeaturedResourcesSection from '~/pages/details/common/featured-resources/featured-resources';
import ShellContextProvider from '../../../../helpers/shell-context';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {ResourceModel} from '~/pages/details/common/resource-box/resource-boxes';

const mockUseUserContext = jest.fn();

jest.mock('~/contexts/user', () => ({
    ...jest.requireActual('~/contexts/user'),
    __esModule: true,
    default: () => mockUseUserContext()
}));

const resourceModels = [
    {
        heading: 'one',
        link: {
            text: 'link1',
            url: 'url1'
        }
    },
    {heading: 'two',
        link: {
            text: 'link2',
            url: 'url2'
        }
    }
] as ResourceModel[];

describe('details/featured-resources', () => {
    const user = userEvent.setup();
    const originalError = console.error;

    it('renders', async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: true
            }
        });
        render(
            <ShellContextProvider>
                <MemoryRouter initialEntries={['/path?Instructor']}>
                    <FeaturedResourcesSection
                        header="section header"
                        models={resourceModels}
                        data-analytics-content-list="featured-resource"
                    />
                </MemoryRouter>
            </ShellContextProvider>
        );
        console.error = jest.fn();
        await user.click(screen.getByRole('link', {name: 'Go to one'}));
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Not implemented: navigation'), undefined);
        console.error = originalError;
    });
});
