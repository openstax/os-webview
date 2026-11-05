import {fetchLoading, fetchSuccess, FetchStateType} from '@openstax/ts-utils/fetch';
import {renderHook, waitFor, act} from '@testing-library/preact';
import * as Sentry from '@sentry/react';
import * as PostHog from '~/helpers/posthog-exceptions';
import * as PageDataUtils from '~/helpers/page-data-utils';
import usePageData, {usePageDataFetchState} from '~/helpers/use-page-data';

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

        const {result} = renderHook(() => usePageDataFetchState<{title: string}>('pages/whatever'));

        expect(result.current).toEqual(fetchLoading());
        await waitFor(() => expect(result.current).toEqual(fetchSuccess({title: 'a_page'})));
    });

    // Before this, a rejected CMS fetch left `data` undefined forever and every
    // consumer sat on its loading state.
    it('hands a retryable fetch failure to onError, and reports it', async () => {
        const failure = new Error('Failed to fetch sticky/: Maximum retries exceeded');
        const onError = jest.fn();

        fetchFromCMS.mockResolvedValue({error: failure, slug: 'snippets/sticky'});

        const {result} = renderHook(() =>
            usePageDataFetchState('snippets/sticky', false, false, onError)
        );

        await waitFor(() => expect(onError).toHaveBeenCalledWith(failure));
        expect(result.current).toEqual({type: FetchStateType.ERROR, error: failure});

        // Handling the rejection takes it away from the unhandled-rejection
        // reporters, so both tools have to hear about it explicitly.
        expect(captureException).toHaveBeenCalledWith(failure);
        expect(reportToPostHog).toHaveBeenCalledWith(failure);
    });

    it('keeps a 404 response as page data', async () => {
        const missing = {error: new Error('page not found'), slug: 'snippets/missing'};

        fetchFromCMS.mockResolvedValue(missing);

        const {result} = renderHook(() =>
            usePageDataFetchState<typeof missing>('snippets/missing')
        );

        await waitFor(() => expect(result.current).toEqual(fetchSuccess(missing)));
        expect(captureException).not.toHaveBeenCalled();
        expect(reportToPostHog).not.toHaveBeenCalled();
    });

    it('wraps a rejection that is not an Error', async () => {
        const onError = jest.fn();

        fetchFromCMS.mockRejectedValue('just a string');

        renderHook(() => usePageDataFetchState('snippets/sticky', false, false, onError));

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
                usePageDataFetchState('pages/whatever', false, false, onError),
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

        const succeeding = renderHook(() => usePageDataFetchState('pages/first'));
        const failing = renderHook(() =>
            usePageDataFetchState('pages/second', false, false, onError)
        );

        succeeding.unmount();
        failing.unmount();

        await act(async () => {
            resolvers[0]({title: 'too_late'});
            rejecters[1](new Error('too late to matter'));
            await new Promise((settle) => window.setTimeout(settle, 0));
        });

        expect(succeeding.result.current).toEqual(fetchLoading());
        expect(onError).not.toHaveBeenCalled();
        // Reported even though nothing is left on screen to show it.
        expect(captureException).toHaveBeenCalledWith(
            expect.objectContaining({message: 'too late to matter'})
        );
    });

    describe('when the slug changes', () => {
        function renderForSlug(slug: string) {
            return renderHook(
                (props: {slug: string}) => usePageDataFetchState<{title: string}>(props.slug),
                {initialProps: {slug}}
            );
        }

        // Waiting for an effect would leave a render where the new slug's state
        // is still the previous page's success
        it('is loading, with the previous page\'s data, on the render where the slug changes', async () => {
            fetchFromCMS.mockResolvedValueOnce({title: 'first'});
            fetchFromCMS.mockReturnValueOnce(new Promise(() => undefined));

            const {result, rerender} = renderForSlug('pages/first');

            expect(result.current).toEqual(fetchLoading());
            await waitFor(() => expect(result.current).toEqual(fetchSuccess({title: 'first'})));

            rerender({slug: 'pages/second'});

            expect(result.current).toEqual(fetchLoading(fetchSuccess({title: 'first'})));
        });

        it('keeps the previous page\'s data when the next page fails to load', async () => {
            const failure = new Error('CMS is down');

            fetchFromCMS.mockResolvedValueOnce({title: 'first'});
            fetchFromCMS.mockRejectedValueOnce(failure);

            const {result, rerender} = renderForSlug('pages/first');

            await waitFor(() => expect(result.current).toEqual(fetchSuccess({title: 'first'})));
            rerender({slug: 'pages/second'});

            await waitFor(() => expect(result.current).toEqual({
                type: FetchStateType.ERROR,
                data: {title: 'first'},
                error: failure
            }));
        });
    });

    describe('usePageData', () => {
        it('returns nothing until the data arrives, then the data', async () => {
            fetchFromCMS.mockResolvedValue({title: 'a_page'});

            const {result} = renderHook(() => usePageData<{title: string}>('pages/whatever'));

            expect(result.current).toBeUndefined();
            await waitFor(() => expect(result.current).toEqual({title: 'a_page'}));
        });

        it('keeps returning the previous page\'s data while the next page loads', async () => {
            fetchFromCMS.mockResolvedValueOnce({title: 'first'});
            fetchFromCMS.mockReturnValueOnce(new Promise(() => undefined));

            const {result, rerender} = renderHook(
                (props: {slug: string}) => usePageData<{title: string}>(props.slug),
                {initialProps: {slug: 'pages/first'}}
            );

            await waitFor(() => expect(result.current).toEqual({title: 'first'}));
            rerender({slug: 'pages/second'});

            expect(result.current).toEqual({title: 'first'});
        });
    });
});
