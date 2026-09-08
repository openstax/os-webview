import React from 'react';
import * as Sentry from '@sentry/react';
import {fetchFromCMS, camelCaseKeys, Json} from '~/helpers/page-data-utils';
import {captureException} from '~/helpers/posthog-exceptions';
import type {LocaleEntry} from '~/components/language-selector/language-selector';

export type Data = {
    translations: [Array<LocaleEntry>];
    error?: string;
    image: number | object;
    [key: string | symbol]: Data | string | undefined | number | object;
};

// eslint-disable-next-line complexity
async function replaceImageNumbersWithImageData(data: Data) {
    if (typeof data.image === 'number') {
        const json = await fetchFromCMS(`images/${data.image}`);

        data.image = json.file || (json.meta || {}).download_url;
    }

    for (const prop of Reflect.ownKeys(data)) {
        if (typeof data[prop] === 'object' && data[prop] !== null) {
            await replaceImageNumbersWithImageData(data[prop] as Data);
        }
    }
}

async function fetchDataAndExpandImages(
    slug: string,
    preserveWrapping: boolean
): Promise<Json> {
    const data = await fetchFromCMS(slug, preserveWrapping);

    await replaceImageNumbersWithImageData(data);

    return data;
}

export function fetchPageData<T>(
    slug: string,
    preserveWrapping: boolean,
    noCamelCase: boolean
): Promise<T> {
    const camelCaseOrNot = noCamelCase ? (obj: unknown) => obj : camelCaseKeys;

    return fetchDataAndExpandImages(slug, preserveWrapping).then(
        camelCaseOrNot
    ) as Promise<T>;
}

// `onError` is optional so that the many callers that only ever read the data
// keep their signature. Handling the rejection at all is the point: a CMS fetch
// that gives up used to leave `data` undefined forever, and the page with it.
export default function usePageData<T>(
    slug: string,
    preserveWrapping = false,
    noCamelCase = false,
    onError?: (error: Error) => void
) {
    const [data, setData] = React.useState<T>();
    // Held in a ref so an inline callback cannot restart the fetch on every
    // render, and so refetching stays keyed to the slug alone.
    const reportError = React.useRef(onError);

    React.useEffect(() => {
        reportError.current = onError;
    }, [onError]);

    React.useEffect(() => {
        let cancelled = false;

        fetchPageData<T>(slug, preserveWrapping, noCamelCase).then(
            (fetched) => {
                if (!cancelled) {
                    setData(fetched);
                }
            },
            (reason: unknown) => {
                const failure =
                    reason instanceof Error ? reason : new Error(String(reason));

                // Handling the rejection takes it away from the
                // unhandled-rejection reporters, so it has to be sent on
                // deliberately or the failure stops being visible.
                Sentry.captureException(failure);
                captureException(failure);
                if (!cancelled) {
                    reportError.current?.(failure);
                }
            }
        );

        return () => {
            cancelled = true;
        };
    }, [slug, preserveWrapping, noCamelCase]);

    return data;
}
