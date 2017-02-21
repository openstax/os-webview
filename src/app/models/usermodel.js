import settings from 'settings';

export const userUrl = `${settings.apiOrigin}/api/user`;
const sfUserUrl = `${settings.apiOrigin}/api/user_salesforce`;
const docUrlBase = `${settings.apiOrigin}/api/documents`;

const LOADED = Symbol();
const LOADED_TIME = Symbol();
const CACHE_FOR_MS = 15000;

class UserModel {

    constructor(url) {
        this.url = url;
        this[LOADED_TIME] = 0;
    }

    load() {
        if (Date.now() > this[LOADED_TIME] + CACHE_FOR_MS) {
            this[LOADED] = fetch(this.url, {credentials: 'include'}).then((response) => response.json());
        }
        return this[LOADED];
    }

    loginLink(returnTo) {
        const encodedLocation = encodeURIComponent(returnTo || window.location.href);

        return `${settings.apiOrigin}/accounts/login/openstax/?next=${encodedLocation}`;
    }

}

export const sfUserModel = new UserModel(sfUserUrl);
export const makeDocModel = (docId) => new UserModel(`${docUrlBase}/${docId}`);
export default new UserModel(userUrl);
