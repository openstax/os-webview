import {FetchState, fetchLoading, fetchSuccess} from '@openstax/ts-utils/fetch';

// What usePageData returns for mocked page data: loaded, or still loading when there is none
export function pageDataState<T>(data: T | null | undefined): FetchState<T, never> {
    return data === null || data === undefined ? fetchLoading() : fetchSuccess(data);
}
