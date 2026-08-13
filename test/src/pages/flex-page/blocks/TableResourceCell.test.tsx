import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {LanguageContextProvider} from '~/contexts/language';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {TableResourceCell} from '~/pages/flex-page/blocks/TableResourceCell';
import type {ResourceRefResolution} from '~/pages/flex-page/blocks/table-resource-links-utils';
import type {ResourceData} from '~/pages/details/common/resource-box/resource-box-utils';
import type {UserStatus} from '~/contexts/user';

const mockUseUserContext = jest.fn();

jest.mock('~/contexts/user', () => ({
    ...jest.requireActual('~/contexts/user'),
    __esModule: true,
    default: () => mockUseUserContext()
}));

const mockTrackLink = jest.fn();

jest.mock('~/pages/details/common/track-link', () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockTrackLink(...args)
}));

function Wrap({children}: React.PropsWithChildren) {
    return (
        <MemoryRouter initialEntries={['/some-flex-page']}>
            <LanguageContextProvider>{children}</LanguageContextProvider>
        </MemoryRouter>
    );
}

function resolution(overrides: Partial<ResourceRefResolution> = {}): ResourceRefResolution {
    return {
        rowIndex: 0,
        cellIndex: 0,
        ref: {bookSlug: 'biology-2e', bookId: 46, heading: 'Instructor’s Manual', resourceType: 'Instructor'},
        status: 'resolved',
        bookId: 46,
        resource: {
            resource: {
                id: 1,
                heading: 'Instructor’s Manual',
                resourceCategory: 'Instructor Resources',
                resourceUnlocked: false,
                description: ''
            },
            linkText: 'Download',
            linkDocument: {file: 'https://files.example.com/im.pdf'},
            comingSoonText: null,
            printLink: null
        } as ResourceData,
        ...overrides
    };
}

describe('TableResourceCell', () => {
    beforeEach(() => {
        mockUseUserContext.mockReset();
        mockTrackLink.mockReset();
    });

    it('renders nothing for a loading resolution', () => {
        mockUseUserContext.mockReturnValue({userStatus: {}});
        const loading = resolution({status: 'loading'});
        const {container} = render(
            <Wrap><TableResourceCell resolution={loading} userStatus={{} as UserStatus} /></Wrap>
        );

        expect(container.innerHTML).toBe('');
    });

    it('renders nothing for an unmatched resolution', () => {
        mockUseUserContext.mockReturnValue({userStatus: {}});
        const {container} = render(
            <Wrap>
                <TableResourceCell
                    resolution={resolution({status: 'unmatched', resource: undefined, bookId: undefined})}
                    userStatus={{} as UserStatus}
                />
            </Wrap>
        );

        expect(container.innerHTML).toBe('');
    });

    it('gives a verified instructor the real url and the same data-* attributes LeftButton sets', () => {
        const userStatus = {isInstructor: true} as UserStatus;

        mockUseUserContext.mockReturnValue({userStatus});
        render(<Wrap><TableResourceCell resolution={resolution()} userStatus={userStatus} /></Wrap>);

        const link = screen.getByRole<HTMLAnchorElement>('link');

        expect(link.href).toBe('https://files.example.com/im.pdf');
        expect(link.getAttribute('data-track')).toBe('Instructor’s Manual');
        expect(link.getAttribute('data-content-type')).toBe('Book Resource (Instructor Resources)');
        expect(link.getAttribute('data-local')).toBe('false');
        expect(link.getAttribute('aria-label')).toBe('Download Instructor’s Manual');
    });

    it('gives a non-verified (anonymous) user the locked state with no real url present', () => {
        const userStatus = {} as UserStatus;

        mockUseUserContext.mockReturnValue({userStatus});
        render(<Wrap><TableResourceCell resolution={resolution()} userStatus={userStatus} /></Wrap>);

        const link = screen.getByRole<HTMLAnchorElement>('link');

        expect(link.textContent).toBe('Login to unlock');
        expect(link.href).not.toContain('files.example.com');
    });

    it('calls trackLink with the resolved book id when an instructor completes the download', async () => {
        const user = userEvent.setup();
        const userStatus = {isInstructor: true} as UserStatus;
        // resourceUnlocked so the download/Give-dialog flow is reachable
        // regardless of instructor status - isolates the trackLink gate
        // (userStatus?.isInstructor) from the link-unlocking logic.
        const unlockedResolution = resolution({
            resource: {
                resource: {
                    id: 2,
                    heading: 'Test Bank',
                    resourceCategory: 'Instructor Resources',
                    resourceUnlocked: true,
                    description: ''
                },
                linkText: 'Download',
                linkDocument: {file: 'https://files.example.com/tb.pdf'},
                comingSoonText: null,
                printLink: null
            } as ResourceData
        });

        mockUseUserContext.mockReturnValue({userStatus});
        render(<Wrap><TableResourceCell resolution={unlockedResolution} userStatus={userStatus} /></Wrap>);
        await user.click(screen.getByRole('link'));
        const downloadLink = await screen.findByText('Go to your resource');

        await user.click(downloadLink);

        expect(mockTrackLink).toHaveBeenCalledWith(expect.anything(), '46');
    });

    it('does not call trackLink when the user completing the download is not an instructor', async () => {
        const user = userEvent.setup();
        const userStatus = {isInstructor: false} as UserStatus;
        const unlockedResolution = resolution({
            resource: {
                resource: {
                    id: 2,
                    heading: 'Test Bank',
                    resourceCategory: 'Instructor Resources',
                    resourceUnlocked: true,
                    description: ''
                },
                linkText: 'Download',
                linkDocument: {file: 'https://files.example.com/tb.pdf'},
                comingSoonText: null,
                printLink: null
            } as ResourceData
        });

        mockUseUserContext.mockReturnValue({userStatus});
        render(<Wrap><TableResourceCell resolution={unlockedResolution} userStatus={userStatus} /></Wrap>);
        await user.click(screen.getByRole('link'));
        const downloadLink = await screen.findByText('Go to your resource');

        await user.click(downloadLink);

        expect(mockTrackLink).not.toHaveBeenCalled();
    });

    it('resolves a Student resource_ref via studentResourceBoxPermissions (the duplicated model-builder)', () => {
        const userStatus = {isStudent: true} as UserStatus;
        const studentResolution = resolution({
            ref: {bookSlug: 'biology-2e', bookId: 46, heading: 'Student Guide', resourceType: 'Student'},
            resource: {
                resourceHeading: 'Student Guide',
                resourceUnlocked: false,
                linkText: 'Visit site',
                linkExternal: 'https://partner.example.com/student-guide',
                comingSoonText: null,
                printLink: null
            } as ResourceData
        });

        mockUseUserContext.mockReturnValue({userStatus});
        render(<Wrap><TableResourceCell resolution={studentResolution} userStatus={userStatus} /></Wrap>);

        const link = screen.getByRole<HTMLAnchorElement>('link');

        expect(link.href).toBe('https://partner.example.com/student-guide');
        expect(link.getAttribute('data-track')).toBe('Student Guide');
    });
});
