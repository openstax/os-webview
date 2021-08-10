import $ from '~/helpers/$';
import bookPromise from '~/models/book-titles';
import {urlFromSlug} from '~/models/cmsFetch';
import React, {useState, useEffect} from 'react';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

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

function loadImages(data) {
    const promises = [];

    if (typeof data.image === 'number') {
        promises.push(fetch(`${$.apiOriginAndPrefix}/images/${data.image}`)
            .then((response) => response.json())
            .then((json) => {
                data.image = json.file || (json.meta || {}).download_url;
            }));
    }

    Reflect.ownKeys(data).forEach((prop) => {
        if (typeof data[prop] === 'object' && data[prop] !== null) {
            promises.push(loadImages(data[prop]));
        }
    });

    return Promise.all(promises);
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
    return preserveWrapping ? data : transformData(data);
}

async function fetchPageData({slug, preserveWrapping, setsPageTitleAndDescription=true}) {
    const data = await fetchFromCMS(slug, preserveWrapping);

    await loadImages(data);
    if (setsPageTitleAndDescription) {
        $.setPageTitleAndDescriptionFromBookData(data);
    }
    return data;
}

export function usePageData(fpdParams) {
    const [pageData, setPageData] = useState();
    let statusPage = null;

    useEffect(() => {
        fetchPageData(fpdParams).then(setPageData);
    }, [fpdParams.slug]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!pageData) {
        statusPage = <LoadingPlaceholder />;
    } else if (pageData.error) {
        statusPage =
            <div className="page error">
                Unable to load page: {pageData.error}
            </div>
        ;
    }

    return [pageData, statusPage];
}

export function useTextFromSlug(slug) {
    const [text, setText] = React.useState();

    React.useEffect(() => {
        const url = urlFromSlug(slug);

        fetch(url).then((r) => r.text()).then((pageHtml) => {
            const parser = new window.DOMParser();
            const newDoc = parser.parseFromString(pageHtml, 'text/html');

            setText(newDoc.body.innerHTML);
        });
    }, [slug]);

    return text;
}
