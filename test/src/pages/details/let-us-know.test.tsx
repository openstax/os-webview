import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import LetUsKnow from '~/pages/details/common/let-us-know/let-us-know';
import type {UserStatus} from '~/contexts/user';

const mockUseUserContext = jest.fn(() => ({userStatus: {} as UserStatus}));

jest.mock('~/contexts/user', () => ({
    ...jest.requireActual('~/contexts/user'),
    __esModule: true,
    default: () => mockUseUserContext()
}));

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';

function Component({title}: {title?: string}) {
    return (
        <ShellContextProvider>
            <LetUsKnow title={title} />
        </ShellContextProvider>
    );
}

describe('details/let-us-know', () => {
    test('handles English title', () => {
        render(<Component title={englishTitle} />);

        screen.getByText('Using this book?', {exact: false});
    });
    test('handles Polish title', () => {
        render(<Component title={polishTitle} />);
        screen.getByText('Korzystasz z tej książki? Daj nam znać.');
    });
    test('hides itself from logged-in students', () => {
        mockUseUserContext.mockReturnValueOnce({
            userStatus: {isStudent: true} as UserStatus
        });
        const {container} = render(<Component title={englishTitle} />);

        expect(container.textContent).toBe('');
    });
    test('stays visible for instructors awaiting verification', () => {
        mockUseUserContext.mockReturnValueOnce({
            userStatus: {isStudent: true, pendingVerification: true} as UserStatus
        });
        render(<Component title={englishTitle} />);

        screen.getByText('Using this book?', {exact: false});
    });
    test('handles empty title', () => {
        const {container} = render(<Component />);

        expect(container.textContent).toBe('');
    });
});
