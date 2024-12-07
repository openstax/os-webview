import React from 'react';
import {render, screen} from '@testing-library/preact';
import InstructorResourceTab from '~/pages/details/desktop-view/instructor-resource-tab/instructor-resource-tab';
import * as DH from '~/helpers/use-document-head';
import bookData from '../../../data/college-algebra-postproc';
import mockRawResourceData from '../../../data/raw-resources';
import {DetailsContextProvider} from '~/pages/details/context';
import ShellContextProvider from '../../../../helpers/shell-context';

const mockUseUserContext = jest.fn();
const mockNavigate = jest.fn();
const mockDataFromSlug = jest.fn(() => mockRawResourceData);

jest.mock('~/contexts/user', () => ({
    __esModule: true,
    default: () => mockUseUserContext(),
    UserContextProvider: ({children}: any) => children // eslint-disable-line
}));
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    __esModule: true,
    useNavigate: () => ({navigate: () => mockNavigate()})
}));

jest.mock('~/helpers/page-data-utils', () => ({
    ...jest.requireActual('~/helpers/page-data-utils'),
    __esModule: true,
    useDataFromSlug: () => mockDataFromSlug()
}));

jest.mock('~/pages/details/common/resource-box/left-content');

function Component({data=bookData}) {
    return (
        <ShellContextProvider>
            <DetailsContextProvider contextValueParameters={{data}}>
                <InstructorResourceTab />
            </DetailsContextProvider>
        </ShellContextProvider>
    );
}

describe('details/instructor-resource-tab', () => {
    beforeEach(() => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: false
            }
        });
    });
    it('returns null until user status exists', async () => {
        mockUseUserContext.mockReturnValue({});
        render(<Component />);
        await expect(screen.findByRole('heading')).rejects.toThrow();
    });
    it('returns SR tab when user status exists', async () => {
        render(<Component />);
        await screen.findByRole('heading', {level: 2, name: 'Find a webinar'});
        screen.getByText('How do I do that?', {exact: false});
        expect(screen.getAllByRole('link')).toHaveLength(10);
    });
    it('handles empty webinarContent', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(<Component data={{...bookData, webinarContent: undefined as any}} />);

        await expect(screen.findByRole('heading', {level: 2, name: 'Find a webinar'})).rejects.toThrow();
    });
    it('puts placeholders for missing text', async () => {
        render(<Component data={{...bookData, partnerListLabel: '', partnerPageLinkText: ''}} />);

        await screen.findByText('[partner_list_label]');
        screen.getByText('[partner_page_link_text]');
    });
    it('chooses blurb by instructor status', async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: true,
                trackDownloads: 'true',
                userInfo: {
                    accounts_id: 12 // eslint-disable-line camelcase
                }
            }
        });
        render(<Component />);
        await screen.findByText('Free resources for verified instructors like you.');
        screen.getAllByRole('link').filter((el) => el.getAttribute('[data-track]'));
    });
    it('chooses blurb for pending instructor', async () => {
        // gets coverage in resource-box-utils::instructorResourceBoxPermissions
        mockUseUserContext.mockReturnValue({
            userStatus: {
                pendingVerification: true,
                userInfo: {id: 123}
            }
        });
        render(<Component />);
        await screen.findByText('for an account to access locked content.', {exact: false});
    });
    it('handles resource-loading failure', async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: true
            },
            isVerified: true
        });
        mockDataFromSlug.mockReturnValue({
            ...mockRawResourceData, error: true
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(<Component />);
        expect(await screen.findAllByRole('link')).toHaveLength(3);
    });
});
