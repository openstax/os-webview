import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import Resources from '~/pages/k12/subject/resources';
import {MemoryRouter} from 'react-router-dom';

let userContext: jest.Mock;

jest.mock('~/contexts/user', () => (userContext = jest.fn()));

// The name must start with mock!
// https://stackoverflow.com/questions/42977961/how-to-mock-an-exported-const-in-jest#comment120341483_64262146
const mockBookTitlesGetter = jest.fn();

jest.mock('~/models/book-titles', () => ({
    get default() {
        return Promise.resolve(mockBookTitlesGetter());
    },
    __esModule: true
}));

describe('k12 subject resources', () => {
    it('renders unlocked resources', async () => {
        userContext.mockReturnValue({
            isVerified: true,
            userStatus: {isInstructor: true}
        });
        mockBookTitlesGetter.mockReturnValue([{title: 'book', id: 73}]);
        render(
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <Resources
                    data={{
                        resourcesHeading: 'Heading',
                        facultyResourceHeaders: [
                            {
                                id: 'faculty-resource-id',
                                heading: 'faculty-heading',
                                book: 'book',
                                resourceUnlocked: true,
                                linkExternal: '#external-link',
                                linkDocumentUrl: 'doc-link'
                            },
                            {
                                id: 'f-r-id2',
                                heading: 'faculty-heading',
                                book: 'book',
                                resourceUnlocked: false,
                                linkExternal: '',
                                linkDocumentUrl: 'doc-link'
                            }
                        ] as Parameters<
                            typeof Resources
                        >[0]['data']['facultyResourceHeaders'],
                        studentResourceHeaders: []
                    }}
                    labels={['one', 'two']}
                    selectedLabel="one"
                    setSelectedLabel={jest.fn()}
                />
            </MemoryRouter>
        );
        let links = screen.getAllByRole('link');

        expect(links).toHaveLength(2);
        const user = userEvent.setup();

        await user.click(links[0]);

        links = screen.getAllByRole('link');
        expect(links).toHaveLength(5);
        expect(links[4].textContent).toBe('Go to your resource');

        await user.click(links[4]);
    });
    it('renders locked resources', () => {
        userContext.mockReturnValue({isVerified: false});
        render(
            <Resources
                data={{
                    resourcesHeading: 'Heading',
                    facultyResourceHeaders: [
                        {
                            id: 'f-r-id3',
                            heading: 'faculty-heading',
                            book: 'book',
                            resourceUnlocked: false,
                            linkExternal: '',
                            linkDocumentUrl: 'doc-link'
                        }
                    ] as Parameters<
                        typeof Resources
                    >[0]['data']['facultyResourceHeaders'],
                    studentResourceHeaders: []
                }}
                labels={['one', 'two']}
                selectedLabel="one"
                setSelectedLabel={jest.fn()}
            />
        );
        expect(screen.queryAllByRole('link')).toHaveLength(0);
        screen.getByText('verified instructor only', {exact: false});
    });
    it('unlocked for non-instructor', async () => {
        userContext.mockReturnValue({
            isVerified: false,
            userStatus: {isInstructor: false}
        });
        mockBookTitlesGetter.mockReturnValue([]);
        render(
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <Resources
                    data={{
                        resourcesHeading: 'Heading',
                        facultyResourceHeaders: [
                            {
                                id: 'faculty-resource-id',
                                heading: 'faculty-heading',
                                book: 'book2',
                                resourceUnlocked: true,
                                linkExternal: '#external-link',
                                linkDocumentUrl: 'doc-link'
                            }
                        ] as Parameters<
                            typeof Resources
                        >[0]['data']['facultyResourceHeaders'],
                        studentResourceHeaders: []
                    }}
                    labels={['one', 'two']}
                    selectedLabel="one"
                    setSelectedLabel={jest.fn()}
                />
            </MemoryRouter>
        );
        let links = screen.getAllByRole('link');

        expect(links).toHaveLength(1);
        const user = userEvent.setup();

        await user.click(links[0]);

        links = screen.getAllByRole('link');
        expect(links).toHaveLength(4);
        expect(links[3].textContent).toBe('Go to your resource');

        await user.click(links[3]);
    });
    it('tracks when instructor book title is not matched', async () => {
        userContext.mockReturnValue({
            isVerified: false,
            userStatus: {isInstructor: true}
        });
        mockBookTitlesGetter.mockReturnValue([]);
        render(
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <Resources
                    data={{
                        resourcesHeading: 'Heading',
                        facultyResourceHeaders: [
                            {
                                id: 'faculty-resource-id',
                                heading: 'faculty-heading',
                                book: 'book2',
                                resourceUnlocked: true,
                                linkExternal: '#external-link',
                                linkDocumentUrl: 'doc-link'
                            }
                        ] as Parameters<
                            typeof Resources
                        >[0]['data']['facultyResourceHeaders'],
                        studentResourceHeaders: []
                    }}
                    labels={['one', 'two']}
                    selectedLabel="one"
                    setSelectedLabel={jest.fn()}
                />
            </MemoryRouter>
        );
        let links = screen.getAllByRole('link');

        expect(links).toHaveLength(1);
        const user = userEvent.setup();

        await user.click(links[0]);

        links = screen.getAllByRole('link');
        expect(links).toHaveLength(4);
        expect(links[3].textContent).toBe('Go to your resource');

        await user.click(links[3]);
    });
});
