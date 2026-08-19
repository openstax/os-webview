import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import Resources from '~/pages/k12/subject/resources';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import { K12SubjectData } from '~/pages/k12/subject/subject';
import * as TL from '~/pages/details/common/track-link';

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


function unlockedResourceData() {
    return {
        resourcesHeading: 'Heading',
        facultyResourceHeaders: [
            {
                id: 'faculty-resource-id',
                heading: 'faculty-heading',
                book: 'book',
                resourceUnlocked: true,
                linkExternal: '#external-link',
                linkDocumentUrl: 'doc-link'
            }
        ] as Parameters<typeof Resources>[0]['data']['facultyResourceHeaders'],
        studentResourceHeaders: []
    } as unknown as K12SubjectData;
}

describe('k12 subject resources', () => {
    // Reset the give-dialog frequency cap so each click test starts uncapped.
    beforeEach(() => window.localStorage.removeItem('giveDialogLastDisplay'));

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
                    } as unknown as K12SubjectData}
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
    it('still reports the download when the dialog is capped', async () => {
        const trackLink = jest.spyOn(TL, 'default');

        userContext.mockReturnValue({
            isVerified: true,
            userStatus: {isInstructor: true}
        });
        mockBookTitlesGetter.mockReturnValue([{title: 'book', id: 73}]);
        window.localStorage.setItem('giveDialogLastDisplay', String(Date.now()));
        render(
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <Resources
                    data={unlockedResourceData()}
                    labels={['one', 'two']}
                    selectedLabel="one"
                    setSelectedLabel={jest.fn()}
                />
            </MemoryRouter>
        );
        const link = await screen.findByText('book');

        expect((link as HTMLElement).dataset.variant).toBe('resource');

        await userEvent.setup().click(link);

        expect(screen.queryByText('Go to your resource')).toBeNull();
        // Synchronously, while the click is still being dispatched.
        expect(trackLink).toHaveBeenCalledWith(expect.anything(), '73');
        trackLink.mockRestore();
    });
    it('reports K12 subject as the download source, on the link and in the dialog', async () => {
        userContext.mockReturnValue({
            isVerified: true,
            userStatus: {isInstructor: true}
        });
        mockBookTitlesGetter.mockReturnValue([{title: 'book', id: 73}]);
        render(
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <Resources
                    data={unlockedResourceData()}
                    labels={['one', 'two']}
                    selectedLabel="one"
                    setSelectedLabel={jest.fn()}
                />
            </MemoryRouter>
        );
        const link = await screen.findByText('book');

        expect((link as HTMLElement).dataset.source).toBe('K12 subject');

        await userEvent.setup().click(link);

        const inDialog = await screen.findByText('Go to your resource');

        expect((inDialog as HTMLElement).dataset.source).toBe('K12 subject');
    });
    it('drops a book-title lookup that lands after unmount', async () => {
        userContext.mockReturnValue({
            isVerified: true,
            userStatus: {isInstructor: true}
        });
        mockBookTitlesGetter.mockReturnValue([{title: 'book', id: 73}]);

        const {unmount} = render(
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <Resources
                    data={unlockedResourceData()}
                    labels={['one', 'two']}
                    selectedLabel="one"
                    setSelectedLabel={jest.fn()}
                />
            </MemoryRouter>
        );

        unmount();
        await Promise.resolve();
        expect(screen.queryByText('book')).toBeNull();
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
                } as unknown as K12SubjectData}
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
                    } as unknown as K12SubjectData}
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
                    } as unknown as K12SubjectData}
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
