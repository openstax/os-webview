import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import DualView from '~/pages/details/dual-view';
import { WindowContextProvider } from '~/contexts/window';
import BookDetailsLoader from './book-details-context';

const mockUseWindowContext = jest.fn();

jest.mock('~/contexts/window', () => ({
    ...jest.requireActual('~/contexts/window'),
    __esModule: true,
    default: () => mockUseWindowContext()
}));
jest.mock('~/pages/details/common/links-to-translations', () => jest.fn());

describe('details/dual-view', () => {
    it('renders at phone width', async () => {
        mockUseWindowContext.mockReturnValue({innerWidth: 480});
        render(
            <WindowContextProvider>
                <BookDetailsLoader slug='books/college-algebra'>
                    <DualView />
                </BookDetailsLoader>
            </WindowContextProvider>
        );

        await screen.findAllByRole('button');
        expect(document?.querySelector('.phone-view')?.textContent?.length).toBeGreaterThan(200);
        expect(document?.querySelector('.bigger-view')?.textContent?.length).toBe(0);
    });
    it('renders at desktop width', async () => {
        mockUseWindowContext.mockReturnValue({innerWidth: 1280});
        render(
            <WindowContextProvider>
                <BookDetailsLoader slug='books/college-algebra'>
                    <DualView />
                </BookDetailsLoader>
            </WindowContextProvider>
        );

        await screen.findAllByRole('button');
        expect(document?.querySelector('.bigger-view')?.textContent?.length).toBeGreaterThan(200);
        expect(document?.querySelector('.phone-view')?.textContent?.length).toBe(0);
    });
});
