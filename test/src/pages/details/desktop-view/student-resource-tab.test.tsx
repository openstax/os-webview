import React from 'react';
import {render, screen} from '@testing-library/preact';
import StudentResourceTab from '~/pages/details/desktop-view/student-resource-tab/student-resource-tab';
import BookDetailsLoader from '../book-details-context';
import * as DH from '~/helpers/use-document-head';

const mockUseUserContext = jest.fn();

jest.mock('~/contexts/user', () => ({
    __esModule: true,
    default: () => mockUseUserContext(),
    UserContextProvider: ({children}: any) => children // eslint-disable-line
}));
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

function Component() {
    return (
        <BookDetailsLoader slug="books/college-algebra">
            <StudentResourceTab />
        </BookDetailsLoader>
    );
}

describe('details/student-resource-tab', () => {
    it('returns null until user status exists', async () => {
        mockUseUserContext.mockReturnValue({});
        render(<Component />);
        let caught = false;

        try {
            await screen.findByRole('heading');
        } catch {
            caught = true;
        }
        expect(caught).toBe(true);
    });
    it('returns SR tab when user status exists', async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: false
            }
        });
        render(<Component />);
        await screen.findByRole('heading', {level: 2});
    });
});
