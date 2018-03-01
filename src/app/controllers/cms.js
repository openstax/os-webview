import settings from 'settings';
import {Controller} from 'superb.js';
import {bookPromise} from '~/models/book-titles';

const TRANSFORM_DATA = Symbol();
const LOAD_IMAGES = Symbol();

const newsPromise = fetch(`${settings.apiOrigin}/api/v2/pages/?slug=openstax-news`)
    .then((r) => r.json())
    .then((r) => r.items[0].meta.detail_url);

class CMSPageController extends Controller {

    constructor(...args) {
        super(...args);
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

            return apiUrl;
        }

        if (this.slug) {
            /* eslint arrow-parens: 0 */ // eslint does not like async arrow functions
            (async () => {
                try {
                    const apiUrl = await getUrlFor(this.slug);
                    const data = await fetch(apiUrl, {credentials: 'include'})
                        .then((response) => response.json());

                    this.pageData = this.preserveWrapping ? data : CMSPageController[TRANSFORM_DATA](data);
                    this.pageData.slug = this.slug;

                    await this[LOAD_IMAGES](this.pageData);

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

    [LOAD_IMAGES](data) {
        const promises = [];

        if (typeof data.image === 'number') {
            promises.push(fetch(`${settings.apiOrigin}/api/images/${data.image}`)
                .then((response) => response.json())
                .then((json) => {
                    data.image = json.file;
                }));
        }

        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (typeof data[prop] === 'object' && data[prop] !== null) {
                    promises.push(this[LOAD_IMAGES](data[prop]));
                }
            }
        }

        return Promise.all(promises);
    }

    static [TRANSFORM_DATA](data) {
        for (const prop in data) {
            if (data.hasOwnProperty(prop) && Array.isArray(data[prop])) {
                data[prop] = data[prop].map((item) => {
                    if (item.value) {
                        return item.value;
                    }

                    return item;
                });
            }
        }

        return data;
    }

}

export default CMSPageController;
