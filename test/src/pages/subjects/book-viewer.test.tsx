import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import BookViewer from '~/pages/subjects/new/specific/book-viewer';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {SpecificSubjectContextProvider} from '~/pages/subjects/new/specific/context';
import businessBooksData from '~/../../test/src/data/business-books';
import {MemoryRouter} from 'react-router-dom';

const mockUsePageData = jest.fn();

jest.mock('~/helpers/use-page-data', () => ({
    __esModule: true,
    default: () => mockUsePageData()
}));

mockUsePageData.mockReturnValue(businessBooksData);

const mockBookTile = jest.fn();

jest.mock('~/components/book-tile/book-tile', () => ({
    __esModule: true,
    default: () => mockBookTile()
}));

mockBookTile.mockImplementation(() => <div className="book-tile" />);

function Component({
    pathAndHash = '/subjects/business'
}: {
    pathAndHash?: string;
}) {
    return (
        <ShellContextProvider>
            <MemoryRouter basename="/subjects" initialEntries={[pathAndHash]}>
                <SpecificSubjectContextProvider contextValueParameters="business">
                    <BookViewer />
                </SpecificSubjectContextProvider>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('subjects/book-viewer', () => {
    afterEach(() => jest.clearAllMocks());
    it('renders', async () => {
        const eventSpy = jest.spyOn(document.body, 'addEventListener');

        render(<Component />);
        expect(await screen.findAllByRole('heading')).toHaveLength(5);
        expect(eventSpy).not.toHaveBeenCalled();
    });
    it('scrolls to hash', async () => {
        const eventSpy = jest.spyOn(document.body, 'addEventListener');

        render(<Component pathAndHash="/subjects/business#Accounting" />);
        expect(await screen.findAllByRole('heading')).toHaveLength(5);
        expect(eventSpy).toHaveBeenCalled();
    });
});
