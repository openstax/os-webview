import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import TitleImage from '~/pages/details/title-image';

const mockUseDetailsContext = jest.fn();

jest.mock('~/pages/details/context', () => ({
    ...jest.requireActual('~/pages/details/context'),
    __esModule: true,
    default: () => mockUseDetailsContext()
}));

describe('title-image', () => {
    it('returns null when no title or title-image', () => {
        mockUseDetailsContext.mockReturnValue({
            reverseGradient: false,
            title: '',
            titleImageUrl: ''
        });
        render(<TitleImage />);
        expect(document.body.innerHTML).toBe('<div></div>');
    });
    it('renders when title and title-image are available', async () => {
        mockUseDetailsContext.mockReturnValue({
            reverseGradient: false,
            title: 'mock-title',
            titleImageUrl: 'mock-title-url'
        });
        render(<TitleImage />);
        await screen.findByRole('img');
    });
});
