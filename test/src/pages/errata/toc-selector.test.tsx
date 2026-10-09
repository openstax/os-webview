import React from 'react';
import {act, render, screen, waitFor} from '@testing-library/preact';
import * as Sentry from '@sentry/react';
import * as PostHog from '~/helpers/posthog-exceptions';
import TocSelector from '~/pages/errata-form/form/ErrorLocationSelector/toc-selector';
import * as EFC from '~/pages/errata-form/errata-form-context';
import rexReleaseData from '~/../../test/src/data/astronomy-toc.json';

const mockBookToc = jest.fn();

jest.mock('~/models/book-toc', () => ({
    __esModule: true,
    default: (slug: string) => mockBookToc(slug)
}));

jest.mock('@sentry/react', () => ({captureException: jest.fn()}));

const mockUseErrataFormContext = jest.spyOn(EFC, 'default');
const reportToSentry = Sentry.captureException as jest.Mock;
const reportToPostHog = jest.spyOn(PostHog, 'captureException');

function setSlug(slug: string) {
    mockUseErrataFormContext.mockReturnValue({
        // @ts-expect-error incomplete structure
        selectedBook: {slug}
    });
}

describe('errata-form/toc-selector', () => {
    beforeEach(() => {
        reportToSentry.mockClear();
        reportToPostHog.mockReset().mockImplementation(() => undefined);
    });
    it('shows no entries, and reports, when the TOC fetch fails', async () => {
        const failure = new Error('Fetching Rex contents: TypeError: Load failed');
        const rejection = Promise.reject(failure);

        mockBookToc.mockReturnValueOnce(rejection);
        setSlug('failing-book');
        render(<TocSelector required={false} updateValue={jest.fn()} />);
        await rejection.catch(() => null);
        expect(mockBookToc).toHaveBeenCalledWith('failing-book');
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        expect(reportToSentry).toHaveBeenCalledWith(failure);
        expect(reportToPostHog).toHaveBeenCalledWith(failure);
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
    it('ignores a previous book TOC that arrives after the slug changes', async () => {
        const updateValue = jest.fn();
        let resolveStale: (contents: unknown) => void;
        const stale = new Promise((resolve) => {
            resolveStale = resolve;
        });
        const rejection = Promise.reject(new Error('Load failed'));

        mockBookToc.mockReturnValueOnce(stale);
        setSlug('slow-book');
        const {rerender} = render(
            <TocSelector required={false} updateValue={updateValue} />
        );

        mockBookToc.mockReturnValueOnce(rejection);
        setSlug('failing-book');
        rerender(<TocSelector required={false} updateValue={updateValue} />);
        await rejection.catch(() => null);

        await act(async () => {
            resolveStale!(rexReleaseData.tree.contents);
            await stale;
        });
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
    it('keeps the current book TOC when a previous one fails late', async () => {
        const updateValue = jest.fn();
        let rejectStale: (reason: unknown) => void;
        const stale = new Promise((_, reject) => {
            rejectStale = reject;
        });

        mockBookToc.mockReturnValueOnce(stale);
        setSlug('slow-book');
        const {rerender} = render(
            <TocSelector required={false} updateValue={updateValue} />
        );

        mockBookToc.mockResolvedValueOnce(rexReleaseData.tree.contents);
        setSlug('good-book');
        rerender(<TocSelector required={false} updateValue={updateValue} />);
        await screen.findByRole('option', {name: 'Preface'});

        await act(async () => {
            rejectStale!('Load failed');
            await stale.catch(() => null);
        });
        screen.getByRole('option', {name: 'Preface'});
        expect((reportToSentry.mock.calls[0][0] as Error).message).toBe(
            'Load failed'
        );
    });
});
