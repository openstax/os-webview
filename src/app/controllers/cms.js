import settings from 'settings';
import {Controller} from 'superb';

const TRANSFORM_DATA = Symbol();
const LOAD_IMAGES = Symbol();

class CMSPageController extends Controller {

    constructor(...args) {
        super(...args);

        if (this.slug) {
            /* eslint arrow-parens: 0 */ // eslint does not like async arrow functions
            (async () => {
                try {
                    const response = await fetch(`${settings.apiOrigin}/api/${this.slug}`);
                    const data = await response.json();

                    this.pageData = this.preserveWrapping ? data : CMSPageController[TRANSFORM_DATA](data);

                    await this[LOAD_IMAGES](this.pageData);

                    this.onDataLoaded();
                } catch (e) {
                    this.onDataError(e);
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
