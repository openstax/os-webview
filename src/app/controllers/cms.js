import settings from 'settings';
import {Controller} from 'superb';

class CMSPageController extends Controller {

    constructor() {
        super();

        if (this.id) {
            fetch(`${settings.apiOrigin}/api/v1/pages/${this.id}/?format=json`)
            .then((response) => response.json())
            .then((json) => {
                this.pageData = json;
                this.onDataLoaded();
            });
        }
    }

    onDataLoaded() {}

}

export default CMSPageController;
