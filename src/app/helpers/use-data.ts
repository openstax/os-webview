// Universal data fetcher/processor to replace the various data-fetching hooks, I hope
import React from 'react';
import {getUrlFor, camelCaseKeys, transformData} from './page-data-utils';

// Any Promise returned by fetch, or a CMS endpoint reference
// we can use to make such a Promise
type UrlSource = {url: string};
type SlugSource = {slug: string};
type PromiseSource = {promise: Promise<Response>};
type SourceOption = UrlSource | SlugSource | PromiseSource;
// Fetched data has a resolveTo step, to extract json or text
// Others are available but not currently used
// https://developer.mozilla.org/en-US/docs/Web/API/Response#instance_methods
type ResponseMethod = 'json' | 'text';
type ProcessingOptions = {
    resolveTo?: ResponseMethod;
    // Common transformations of CMS data
    transform?: boolean;
    camelCase?: boolean;
    postProcess?: (rawData: unknown) => unknown;
};

export default function useFetchedData<T>(
    {resolveTo = 'json', ...options}: SourceOption & ProcessingOptions,
    defaultValue: T
): T {
    const slug = (options as SlugSource).slug;
    const slugPromise = React.useMemo(() => {
        if (!slug) {
            return null;
        }
        return new Promise<Response>((resolve) =>
            getUrlFor(slug).then((url: string) => fetch(url).then(resolve))
        );
    }, [slug]);
    const url = (options as UrlSource).url;
    const urlPromise = React.useMemo(() => {
        if (!url) {
            return null;
        }
        return fetch(url);
    }, [url]);
    const promiseOption: Promise<Response> | null = (options as PromiseSource)
        .promise;
    const promise: Promise<Response> = React.useMemo(
        () => slugPromise ?? urlPromise ?? promiseOption,
        [slugPromise, urlPromise, promiseOption]
    );
    const processedPromise = React.useMemo(
        () =>
            promise
                .then((resp) => resp[resolveTo]())
                .then((rawData) => processRawData<T>(rawData, options)),
        [promise, resolveTo] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return usePromise(processedPromise, defaultValue);
}

// This is a common pattern. Should be used throughout the codebase
export function usePromise<T>(promise: Promise<T>, defaultValue: T) {
    const [data, setData] = React.useState(defaultValue);

    React.useEffect(() => {
        promise.then(setData);
    }, [promise]);

    return data;
}

function processRawData<T>(
    rawData: unknown,
    processing: Omit<ProcessingOptions, 'resolveTo'>
): T {
    let returnValue = rawData;

    if (processing.transform) {
        // mutates
        transformData(rawData);
    }
    if (processing.camelCase) {
        returnValue = camelCaseKeys(rawData);
    }
    if (processing.postProcess) {
        returnValue = (returnValue as Array<unknown>).map(
            processing.postProcess
        );
    }

    return returnValue as T;
}
