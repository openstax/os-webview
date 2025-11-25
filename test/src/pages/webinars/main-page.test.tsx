import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import MainPage from '~/pages/webinars/main-page/main-page';
import * as UWC from '~/pages/webinars/webinar-context';
import * as UDH from '~/helpers/use-document-head';
import {pageData} from '../../data/webinars';

function Component() {
    return (
        <MemoryRouter initialEntries={['/webinars']}>
            <MainPage />
        </MemoryRouter>
    );
}

const mockUseWebinarContext = jest.spyOn(UWC, 'default');

jest.spyOn(UDH, 'default').mockImplementation(
    () => null
);

describe('webinars main page', () => {
    it('renders the main page', () => {
        mockUseWebinarContext.mockReturnValue({
            pageData,
            past: [],
            upcoming: [],
            subjects: [],
            collections: [],
            searchFor: jest.fn(),
            latestWebinars: []
        });
        render(<Component />);
        expect(screen.getByText(pageData.heading)).toBeTruthy();
    });
});
