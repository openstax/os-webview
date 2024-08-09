import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import BookDetailsLoader from './book-details-context';
import LinksToTranslations from '~/pages/details/common/links-to-translations';
import * as detailCtx from '~/pages/details/context';

describe('LinksToTranslations', () => {
    it('renders translations', async () => {
        render(
            <BookDetailsLoader slug="books/college-algebra">
                <LinksToTranslations />
            </BookDetailsLoader>
        );
        await screen.findByText('This textbook is available', {exact: false});
    });
    it('renders empty when there are no translations', async () => {
        const mockUseDetailsContext = jest.spyOn(detailCtx, 'default');

        mockUseDetailsContext.mockReturnValue({
            translations: []
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(
            <BookDetailsLoader slug="books/college-algebra">
                <LinksToTranslations />
            </BookDetailsLoader>
        );

        await waitFor(() => expect(mockUseDetailsContext).toHaveBeenCalled());
        expect(document.body.textContent).toBe('');
        mockUseDetailsContext.mockClear();
    });
});
