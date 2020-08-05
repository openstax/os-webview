import $ from '~/helpers/$';
import bookPromise from '~/models/book-titles';
import {urlFromSlug} from '~/models/cmsFetch';
import React, {useState, useEffect} from 'react';
import {useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';

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

    const qsChar = (/\?/.test(apiUrl)) ? '&' : '?';

    return `${apiUrl}${qsChar}format=json`;
}

export async function fetchFromCMS(slug, preserveWrapping=false) {
    const apiUrl = await getUrlFor(slug);
    let data;

    try {
        data = await (await fetch(apiUrl, {credentials: 'include'})).json();
    } catch (err) {
        console.warn(`ERROR fetching slug ${slug}: ${err}`);
        data = {error: err};
    }

    data.slug = slug;
    return preserveWrapping ? data : transformData(data);
}

function setTitleAndDescription(data) {
    const meta = data.meta || {};
    const defaultDescription = data.description ?
        $.htmlToText(data.description) : '';

    $.setPageTitleAndDescription(
        meta.seo_title || data.title,
        meta.search_description || defaultDescription
    );
}

export async function fetchPageData({slug, preserveWrapping, setsPageTitleAndDescription=true}) {
    const data = await fetchFromCMS(slug, preserveWrapping);

    await loadImages(data);
    if (setsPageTitleAndDescription) {
        setTitleAndDescription(data);
    }
    return data;
}

export function usePageData(fpdParams) {
    const [pageData, setPageData] = useState();
    const [pageDataError, setPageDataError] = useState();
    let statusPage = null;

    useEffect(() => {
        async function fetchData() {
            try {
                setPageData(await fetchPageData(fpdParams));
            } catch (err) {
                setPageDataError(err);
            }
        }
        fetchData();
    }, [fpdParams.slug]);
    useCanonicalLink(Boolean(fpdParams.setTitleAndDescription));

    if (pageDataError) {
        statusPage =
            <div className="page error">
                Unable to load page: {pageDataError}
            </div>
        ;
    }
    if (!pageData) {
        statusPage =
            <div className="content loading" />
        ;
    }

    return [pageData, statusPage];
}

export default (superclass) => class extends superclass {

    constructor(...args) {
        super(...args);

        if (this.slug) {
            // eslint-disable-next-line complexity
            (async () => {
                try {
                    const mainEl = document.getElementById('main');
                    const parentIsMainEl = mainEl && this.el && this.el.parentNode === mainEl;

                    this.pageData = await fetchPageData({
                        slug: this.slug,
                        preserveWrapping: this.preserveWrapping,
                        setsPageTitleAndDescription: this.setsPageTitleAndDescription || parentIsMainEl
                    });
                    this.onDataLoaded();
                } catch (e) {
                    if (this.onDataError) {
                        console.warn('Died fetching', this.slug);
                        this.onDataError(e);
                    } else {
                        console.error(e);
                    }
                }
            })();
        }
    }

};
