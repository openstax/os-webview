import React from 'react';
import bookPromise from '~/models/book-titles';
import urlFromSlug from './url-from-slug';

export function transformData(data) {
    Reflect.ownKeys(data).forEach((prop) => {
        if (Array.isArray(data[prop])) {
            const arr = data[prop];
            const contentItem = arr.filter((e) => e.type === 'content').length === 1;

            if (contentItem) {
                data[prop] = {};
                arr.forEach((v) => {
                    data[prop][v.type] = v.value;
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

async function getUrlFor(initialSlug) {
    let apiUrl = urlFromSlug(initialSlug);

    // A little magic to handle book titles
    if (initialSlug.startsWith('books/')) {
        const strippedSlug = initialSlug.substr(6);

        if (strippedSlug) {
            const bookList = await bookPromise;
            const bookEntry = bookList.find((e) => e.meta.slug === strippedSlug);

            if (bookEntry) {
                apiUrl = bookEntry.meta.detail_url;
            }
        }
    }

    const qsChar = ((/\?/).test(apiUrl)) ? '&' : '?';

    return `${apiUrl}${qsChar}format=json`;
}

function camelCase(underscored) {
    return underscored.replace(/_+([a-z0-9])/g, (_, chr) => chr ? chr.toUpperCase() : '');
}

export function camelCaseKeys(obj) {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Array) {
        return obj.map((v) => camelCaseKeys(v));
    }

    return Reflect.ownKeys(obj).reduce((result, k) => {
        result[camelCase(k)] = camelCaseKeys(obj[k]);
        return result;
    }, {});
}

export async function fetchFromCMS(slug, preserveWrapping=false) {
    const apiUrl = await getUrlFor(slug);
    let data;

    try {
        data = await (await fetch(apiUrl)).json();
    } catch (err) {
        console.warn(`ERROR fetching slug ${slug}: ${err}`);
        data = {error: err};
    }

    data.slug = slug;
    return (preserveWrapping || data.error) ? data : transformData(data);
}

export function useTextFromSlug(slug) {
    const [text, setText] = React.useState();
    const [head, setHead] = React.useState();

    React.useEffect(() => {
        const url = urlFromSlug(slug);

        fetch(url)
            .then((r) => {
                if (r?.ok) {
                    r.text().then((pageHtml) => {
                        const parser = new window.DOMParser();
                        const newDoc = parser.parseFromString(pageHtml, 'text/html');

                        setText(newDoc.body.innerHTML);
                        setHead({
                            title: newDoc.head.querySelector('title')?.textContent,
                            description: newDoc.head.querySelector('[name="description"]')?.getAttribute('content')
                        });
                    });
                } else {
                    setText(new Error(r?.statusText || `Failed to load ${slug}`));
                }
            })
            .catch((err) => setText(err));
    }, [slug]);

    return {head, text};
}

export function useDataFromPromise(promise, defaultValue) {
    const [data, setData] = React.useState(defaultValue);

    React.useEffect(() => {
        if (promise) {
            promise.then(setData);
        } else {
            setData(null);
        }
    }, [promise]);

    return data;
}

export function useDataFromSlug(slug, preserveWrapping=false) {
    const promise = React.useMemo(
        () => slug ? fetchFromCMS(slug, preserveWrapping) : null,
        [slug, preserveWrapping]
    );

    return useDataFromPromise(promise);
}
