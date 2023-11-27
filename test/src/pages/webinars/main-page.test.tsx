import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import {RouterContextProvider} from '~/components/shell/router-context';
import MainPage from '~/pages/webinars/main-page/main-page';
import useWebinarContext from '~/pages/webinars/webinar-context';
import {pageData} from '../../data/webinars';

function Component() {
    return (
        <MemoryRouter initialEntries={['/webinars']}>
            <RouterContextProvider>
                <MainPage />
            </RouterContextProvider>
        </MemoryRouter>
    );
}

jest.mock('~/pages/webinars/webinar-context', () => jest.fn());

describe('webinars main page', () => {
    it('renders the main page', () => {
        (useWebinarContext as jest.Mock).mockReturnValue({
            pageData
        });
        render(<Component />);
        expect(screen.getByText(pageData.heading)).toBeTruthy();
    });
});
