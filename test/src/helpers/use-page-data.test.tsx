import {renderHook, waitFor, act} from '@testing-library/preact';
import * as Sentry from '@sentry/react';
import * as PostHog from '~/helpers/posthog-exceptions';
import * as PageDataUtils from '~/helpers/page-data-utils';
import usePageData from '~/helpers/use-page-data';

jest.mock('@sentry/react', () => ({captureException: jest.fn()}));

const captureException = Sentry.captureException as jest.Mock;
const fetchFromCMS = jest.spyOn(PageDataUtils, 'fetchFromCMS');
const reportToPostHog = jest.spyOn(PostHog, 'captureException');

describe('use-page-data', () => {
    beforeEach(() => {
        captureException.mockClear();
        fetchFromCMS.mockReset();
        reportToPostHog.mockReset().mockImplementation(() => undefined);
    });

    it('returns the data once it arrives', async () => {
        fetchFromCMS.mockResolvedValue({title: 'a_page'});

        const {result} = renderHook(() => usePageData<{title: string}>('pages/whatever'));

        await waitFor(() => expect(result.current).toEqual({title: 'a_page'}));
    });

    // Before this, a rejected CMS fetch left `data` undefined forever and every
    // consumer sat on its loading state.
    it('hands a rejected fetch to onError, and reports it', async () => {
        const failure = new Error('Failed to fetch sticky/: Maximum retries exceeded');
        const onError = jest.fn();

        fetchFromCMS.mockRejectedValue(failure);

        const {result} = renderHook(() =>
            usePageData('snippets/sticky', false, false, onError)
        );

        await waitFor(() => expect(onError).toHaveBeenCalledWith(failure));
        expect(result.current).toBeUndefined();

        // Handling the rejection takes it away from the unhandled-rejection
        // reporters, so both tools have to hear about it explicitly.
        expect(captureException).toHaveBeenCalledWith(failure);
        expect(reportToPostHog).toHaveBeenCalledWith(failure);
    });

    it('wraps a rejection that is not an Error', async () => {
        const onError = jest.fn();

        fetchFromCMS.mockRejectedValue('just a string');

        renderHook(() => usePageData('snippets/sticky', false, false, onError));

        await waitFor(() =>
            expect(onError).toHaveBeenCalledWith(
                expect.objectContaining({message: 'just a string'})
            )
        );
    });

    // An inline callback changes identity every render; refetching on that
    // would loop forever.
    it('does not refetch when only the error handler changes', async () => {
        fetchFromCMS.mockResolvedValue({title: 'a_page'});

        const {rerender} = renderHook(
            ({onError}: {onError: () => void}) =>
                usePageData('pages/whatever', false, false, onError),
            {initialProps: {onError: jest.fn()}}
        );

        await waitFor(() => expect(fetchFromCMS).toHaveBeenCalledTimes(1));
        rerender({onError: jest.fn()});
        await waitFor(() => expect(fetchFromCMS).toHaveBeenCalledTimes(1));
    });

    it('drops a response that arrives after the caller has moved on', async () => {
        const resolvers: ((value: unknown) => void)[] = [];
        const rejecters: ((reason: Error) => void)[] = [];
        const onError = jest.fn();

        fetchFromCMS.mockImplementation(
            () =>
                new Promise((resolve, reject) => {
                    resolvers.push(resolve);
                    rejecters.push(reject);
                })
        );

        const succeeding = renderHook(() => usePageData('pages/first'));
        const failing = renderHook(() =>
            usePageData('pages/second', false, false, onError)
        );

        succeeding.unmount();
        failing.unmount();

        await act(async () => {
            resolvers[0]({title: 'too_late'});
            rejecters[1](new Error('too late to matter'));
            await new Promise((settle) => window.setTimeout(settle, 0));
        });

        expect(succeeding.result.current).toBeUndefined();
        expect(onError).not.toHaveBeenCalled();
        // Reported even though nothing is left on screen to show it.
        expect(captureException).toHaveBeenCalledWith(
            expect.objectContaining({message: 'too late to matter'})
        );
    });
});
