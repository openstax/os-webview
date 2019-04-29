import settings from 'settings';
import $ from '~/helpers/$';
import {bookPromise} from '~/models/book-titles';

const TRANSFORM_DATA = Symbol();
const LOAD_IMAGES = Symbol();

const newsPromise = fetch(`${settings.apiOrigin}${settings.apiPrefix}/v2/pages/?slug=openstax-news`)
    .then((r) => r.json())
    .then((r) => r.items[0].meta.detail_url);

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

async function getUrlFor(slug) {
    let apiUrl = `${settings.apiOrigin}/api/${slug}`;

    // A little magic to handle book titles
    const strippedSlug = slug.replace(/^books\/(.*)/, '$1');

    if (strippedSlug) {
        const bookList = await bookPromise;
        const bookEntry = bookList.find((e) => e.meta.slug === strippedSlug);

        if (bookEntry) {
            apiUrl = bookEntry.meta.detail_url;
        }
    }

    // A little magic to handle the news slug
    if (slug === 'news') {
        apiUrl = await newsPromise;
    }

    const qsChar = (/\?/.test(apiUrl)) ? '&' : '?';

    return `${apiUrl}${qsChar}format=json`;
}

export async function fetchFromCMS(slug, preserveWrapping) {
    const apiUrl = await getUrlFor(slug);
    const data = await fetch(apiUrl, {credentials: 'include'})
        .then((response) => response.json());

    data.slug = slug;
    return preserveWrapping ? data : transformData(data);
}

export default (superclass) => class extends superclass {

    constructor(...args) {
        super(...args);

        if (this.slug) {
            /* eslint arrow-parens: 0 */ // eslint does not like async arrow functions
            (async () => {
                const setPageDescriptor = () => {
                    const setTitleAndDescription = () => {
                        const pageData = this.pageData;
                        const meta = pageData.meta || {};
                        const defaultDescription = pageData.description ?
                            $.htmlToText(pageData.description) : '';

                        $.setPageTitleAndDescription(
                            meta.seo_title || pageData.title,
                            meta.search_description || defaultDescription
                        );
                    };

                    // If this component is the content of main, set page descriptor
                    if (document && this.el && this.el.parentNode) {
                        const mainEl = document.getElementById('main');

                        if (mainEl && this.el.parentNode === mainEl) {
                            setTitleAndDescription();
                        }
                    }
                };

                try {
                    this.pageData = await fetchFromCMS(this.slug, this.preserveWrapping);
                    await this[LOAD_IMAGES](this.pageData);
                    setPageDescriptor();

                    this.onDataLoaded();
                } catch (e) {
                    if (this.onDataError) {
                        this.onDataError(e);
                    } else {
                        console.error(e);
                    }
                }
            })();
        }
    }

    /* eslint complexity: 0 */
    [LOAD_IMAGES](data) {
        const promises = [];

        if (typeof data.image === 'number') {
            promises.push(fetch(`${settings.apiOrigin}${settings.apiPrefix}/images/${data.image}`)
                .then((response) => response.json())
                .then((json) => {
                    data.image = json.file;
                }));
        }

        Reflect.ownKeys(data).forEach((prop) => {
            if (typeof data[prop] === 'object' && data[prop] !== null) {
                promises.push(this[LOAD_IMAGES](data[prop]));
            }
        });

        return Promise.all(promises);
    }

};
