import React from 'react';
import bookPromise from '~/models/book-titles';
import urlFromSlug from './url-from-slug';

type TypeAndValue = {
    type: string;
    value: string;
};

export type Json =
    | boolean
    | string
    | number
    | null
    | Json[]
    | {[key: string]: Json};

export function transformData(data: Record<string, Json>) {
    Object.keys(data).forEach((prop) => {
        if (Array.isArray(data[prop])) {
            const arr = data[prop] as TypeAndValue[];
            const contentItem =
                arr.filter((e) => e.type === 'content').length === 1;

            if (contentItem) {
                data[prop] = {};
                arr.forEach((v) => {
                    (data[prop] as Record<string, string>)[v.type] = v.value;
                });
            } else {
                data[prop] = arr.map((item) => {
                    if (item.value) {
                        return item.value;
                    }
                    return item;
                });
            }
        }
    });

    return data;
}

export async function getUrlFor(initialSlug: string) {
    let apiUrl = urlFromSlug(initialSlug);

    // A little magic to handle book titles
    if (initialSlug.startsWith('books/') && initialSlug.length > 6) {
        const strippedSlug = initialSlug.substring(6);

        const bookList = await bookPromise;
        const bookEntry = bookList.find(
            (e) => e.meta.slug === strippedSlug
        );

        if (bookEntry) {
            apiUrl = bookEntry.meta.detail_url;
        }
    }

    const qsChar = (/\?/).test(apiUrl) ? '&' : '?';

    return `${apiUrl}${qsChar}format=json`;
}

function camelCase(underscored: string) {
    return underscored.replace(/_+([a-z0-9])/g, (_, chr: string) =>
        chr.toUpperCase()
    );
}

export function camelCaseKeys(obj?: Json): Json | undefined {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Array) {
        return obj.map((v) => camelCaseKeys(v)) as Json;
    }

    return Object.keys(obj).reduce((result, k) => {
        result[camelCase(k)] = camelCaseKeys(obj[k]) as Json;
        return result;
    }, {} as Record<string, Json>);
}

export async function fetchFromCMS(slug: string, preserveWrapping = false) {
    const apiUrl = await getUrlFor(slug);
    let data;

    try {
        data = await fetch(apiUrl).then((response) => {
            if (response.status === 404) {
                return {error: new Error('page not found')};
            }

            return response.json();
        });
    } catch (err) {
        console.warn(`ERROR fetching slug ${slug}: ${err}`);
        data = {error: err};
    }

    data.slug = slug;
    return preserveWrapping || data.error ? data : transformData(data);
}

export function useTextFromSlug(slug: string) {
    const [text, setText] = React.useState<string | Error>();
    const [head, setHead] = React.useState<{
        title?: string | null;
        description?: string | null;
    }>();

    React.useEffect(() => {
        const url = urlFromSlug(slug);

        fetch(url)
            .then((r) => {
                if (r?.ok) {
                    r.text().then((pageHtml) => {
                        const parser = new window.DOMParser();
                        const newDoc = parser.parseFromString(
                            pageHtml,
                            'text/html'
                        );

                        setText(newDoc.body.innerHTML);
                        setHead({
                            title: newDoc.head.querySelector('title')
                                ?.textContent,
                            description: newDoc.head
                                .querySelector('[name="description"]')
                                ?.getAttribute('content')
                        });
                    });
                } else {
                    setText(
                        new Error(r?.statusText || `Failed to load ${slug}`)
                    );
                }
            })
            .catch((err) => setText(err));
    }, [slug]);

    return {head, text};
}

export function useDataFromPromise<T = Json>(
    promise: Promise<T> | null,
    defaultValue?: T
) {
    const [data, setData] = React.useState<T | null | undefined>(defaultValue);

    React.useEffect(() => {
        if (promise) {
            promise.then(setData);
        } else {
            setData(null);
        }
    }, [promise]);

    return data;
}

export function useDataFromSlug<T = Json>(
    slug: string | null,
    preserveWrapping = false
) {
    const promise = React.useMemo(
        () => (slug ? fetchFromCMS(slug, preserveWrapping) : null),
        [slug, preserveWrapping]
    );

    return useDataFromPromise<T>(promise);
}
