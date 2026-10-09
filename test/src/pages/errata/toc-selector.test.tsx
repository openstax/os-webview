import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import TocSelector from '~/pages/errata-form/form/ErrorLocationSelector/toc-selector';
import * as EFC from '~/pages/errata-form/errata-form-context';
import rexReleaseData from '~/../../test/src/data/astronomy-toc.json';

const mockBookToc = jest.fn();

jest.mock('~/models/book-toc', () => ({
    __esModule: true,
    default: (slug: string) => mockBookToc(slug)
}));

const mockUseErrataFormContext = jest.spyOn(EFC, 'default');

function setSlug(slug: string) {
    mockUseErrataFormContext.mockReturnValue({
        // @ts-expect-error incomplete structure
        selectedBook: {slug}
    });
}

describe('errata-form/toc-selector', () => {
    it('shows no entries when the TOC fetch fails', async () => {
        const rejection = Promise.reject(
            new Error('Fetching Rex contents: TypeError: Load failed')
        );

        mockBookToc.mockReturnValueOnce(rejection);
        setSlug('failing-book');
        render(<TocSelector required={false} updateValue={jest.fn()} />);
        await rejection.catch(() => null);
        expect(mockBookToc).toHaveBeenCalledWith('failing-book');
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
    it('clears the previous book TOC when the next one fails', async () => {
        const updateValue = jest.fn();

        mockBookToc.mockResolvedValueOnce(rexReleaseData.tree.contents);
        setSlug('good-book');
        const {rerender} = render(
            <TocSelector required={false} updateValue={updateValue} />
        );

        await screen.findByRole('option', {name: 'Preface'});

        mockBookToc.mockRejectedValueOnce(new Error('Load failed'));
        setSlug('failing-book');
        rerender(<TocSelector required={false} updateValue={updateValue} />);
        await waitFor(() =>
            expect(screen.queryAllByRole('option')).toHaveLength(0)
        );
    });
});
