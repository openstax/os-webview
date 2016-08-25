import settings from 'settings';
import {Controller} from 'superb';

const TRANSFORM_DATA = Symbol();
const LOAD_IMAGES = Symbol();

class CMSPageController extends Controller {

    constructor(...args) {
        super(...args);

        if (this.slug) {
            /* eslint arrow-parens: 0 */ // Fix eslint bug with async arrow functions
            (async () => {
                try {
                    const response = await fetch(`${settings.apiOrigin}/api/${this.slug}`);
                    const data = await response.json();

                    this.pageData = CMSPageController[TRANSFORM_DATA](data);

                    await this[LOAD_IMAGES](this.pageData);

                    this.onDataLoaded();
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }

    [LOAD_IMAGES](data) {
        const promises = [
            new Promise((resolve) => {
                if (typeof data.image === 'number') {
                    fetch(`${settings.apiOrigin}/api/images/${data.image}`)
                    .then((response) => response.json())
                    .then((json) => {
                        data.image = json.file;
                        resolve();
                    });
                } else {
                    resolve();
                }
            })
        ];

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
