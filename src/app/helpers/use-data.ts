// Universal data fetcher/processor to replace the various data-fetching hooks, I hope
import React from 'react';
import {getUrlFor, camelCaseKeys, transformData} from './page-data-utils';

type UrlSource = {url: string};
type SlugSource = {slug: string};
type PromiseSource = {promise: Promise<Response>};
// Any Promise returned by fetch, or a CMS endpoint reference
// we can use to make such a Promise
type SourceOption = UrlSource | SlugSource | PromiseSource;
// Fetched data has a resolveTo step, to extract json or text
// Others are available but not currently used
// https://developer.mozilla.org/en-US/docs/Web/API/Response#instance_methods
type ResponseMethod = 'json' | 'text';
type ProcessingOptions = {
    resolveTo: ResponseMethod;
    // Common transformations of CMS data
    transform?: boolean;
    camelCase?: boolean;
};

export default function useFetchedData<T>(
    options: SourceOption & ProcessingOptions,
    defaultValue: T
) {
    return usePromise(
        getFetchPromise(options)
            .then((resp) => resp[options.resolveTo]())
            .then((rawData) => processRawData(rawData, options)),
        defaultValue
    );
}

// This is a common pattern. Should be abstracting it to use this
// throughout the codebase
export function usePromise<T>(promise: Promise<T>, defaultValue?: T) {
    const [data, setData] = React.useState(defaultValue);

    React.useEffect(() => {
        promise.then(setData);
    }, []);

    return data;
}

function getFetchPromise(source: SourceOption): Promise<Response> {
    if ('promise' in source) {
        return source.promise;
    }
    if ('slug' in source) {
        return new Promise((resolve) =>
            getUrlFor(source.slug).then((url: string) =>
                fetch(url).then(resolve)
            )
        );
    }
    return fetch(source.url);
}

function processRawData<T>(rawData: T, processing: ProcessingOptions): T {
    if (processing.transform) {
        // mutates
        transformData(rawData);
    }
    if (processing.camelCase) {
        // returns new data
        return camelCaseKeys(rawData);
    }

    return rawData;
}
