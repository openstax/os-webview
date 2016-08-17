import settings from 'settings';
import {Controller} from 'superb';

const TRANSFORM_DATA = Symbol();

class CMSPageController extends Controller {

    constructor(...args) {
        super(...args);

        if (this.slug) {
            fetch(`${settings.apiOrigin}/api/${this.slug}`)
            .then((response) => response.json())
            .then((data) => {
                this.pageData = CMSPageController[TRANSFORM_DATA](data);
                this.onDataLoaded();
            });
        }
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
