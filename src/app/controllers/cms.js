import settings from 'settings';
import {Controller} from 'superb';

const cmsPageUrl = `${settings.apiOrigin}/api/v1/pages`;
const jsonToQueryString = (json) =>
    Object.keys(json).map((key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
    ).join('&');
const toJson = (response) => response.json();

class CMSPageController extends Controller {

    constructor(...args) {
        super(...args);

        if (this.id) {
            fetch(`${cmsPageUrl}/${this.id}/?format=json`)
            .then(toJson)
            .then((json) => {
                this.pageData = json;
                this.onDataLoaded();
            });
        } else if (this.query) {
            fetch(`${cmsPageUrl}/?format=json&${jsonToQueryString(this.query)}`)
            .then(toJson)
            .then((json) => {
                this.pageData = json;
                this.onDataLoaded();
            });
        } else if (this.queryPage) {
            fetch(`${cmsPageUrl}/?format=json&${jsonToQueryString(this.queryPage)}`)
            .then(toJson)
            .then((response) => {
                const pageUrl = response.pages[0].meta.detail_url;

                fetch(pageUrl).then(toJson)
                .then((json) => {
                    this.pageData = json;
                    this.onDataLoaded();
                });
            });
        }
    }

    onDataLoaded() {}

}

export default CMSPageController;
