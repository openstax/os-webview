import settings from 'settings';

export const userUrl = `${settings.apiOrigin}/api/user`;
const sfUserUrl = `${settings.apiOrigin}/api/user_salesforce`;
const docUrlBase = `${settings.apiOrigin}/api/documents`;

const LOADED = Symbol();

class UserModel {

    constructor(url) {
        this.url = url;
    }

    load(qs = {}) {
        const query = Object.keys(qs)
        .map((k) => `${encodeURIComponent(k)} = ${encodeURIComponent(qs[k])}`)
        .join('&');
        const url = this.url + (query.length ? `?${query}` : '');

        this[LOADED] = fetch(url, {credentials: 'include'}).then((response) => response.json());
        return this[LOADED];
    }

}

export const sfUserModel = new UserModel(sfUserUrl);
export const makeDocModel = (docId) => new UserModel(`${docUrlBase}/${docId}`);
export default new UserModel(userUrl);
