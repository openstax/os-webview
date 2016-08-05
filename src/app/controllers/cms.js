import settings from 'settings';
import router from '~/router';
import NotFound from '~/pages/404/404';
import {Controller} from 'superb';

const cmsPageSlugUrl = `${settings.apiOrigin}/api/pages`;
const cmsPageUrl = `${settings.apiOrigin}/api/v1/pages`;
const jsonToQueryString = (json) =>
    Object.keys(json).map((key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
    ).join('&');
const toJson = (response) => response.json();

class CMSPageController extends Controller {

    constructor(...args) {
        super(...args);
        const fetchAndLoad = (path) => {
            fetch(path).then(toJson).then((json) => {
                this.pageData = json;
                this.onDataLoaded();
            });
        };

        if (this.id) {
            fetchAndLoad(`${cmsPageUrl}/${this.id}/?format=json`);
        } else if (this.slug) {
            fetchAndLoad(`${cmsPageSlugUrl}/${this.slug}/?format=json`);
        } else if (this.query) {
            fetchAndLoad(`${cmsPageUrl}/?format=json&${jsonToQueryString(this.query)}`);
        } else if (this.queryPage) {
            fetch(`${cmsPageUrl}/?format=json&${jsonToQueryString(this.queryPage)}`)
            .then(toJson)
            .then((response) => {
                try {
                    const pageUrl = response.pages[0].meta.detail_url;

                    fetch(pageUrl).then(toJson)
                    .then((json) => {
                        this.pageData = json;
                        this.onDataLoaded();
                    });
                } catch (e) {
                    this.onDataError(e);
                }
            });
        }
    }

    onDataLoaded() {}

    onDataError() {
        this.regions.self.attach(new NotFound());
    }

}

export default CMSPageController;
