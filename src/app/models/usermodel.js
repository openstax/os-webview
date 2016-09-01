import settings from 'settings';

const userUrl = `${settings.apiOrigin}/api/user`;
const sfUserUrl = `${settings.apiOrigin}/api/user_salesforce`;
const docUrlBase = `${settings.apiOrigin}/api/documents`;

const LOADED = Symbol();

class UserModel {

    constructor(url) {
        this[LOADED] = fetch(url).then((response) => response.json());
    }

    load() {
        return this[LOADED];
    }

}

export const sfUserModel = new UserModel(sfUserUrl);
export const makeDocModel = (docId) => new UserModel(`${docUrlBase}/${docId}`);
export default new UserModel(userUrl);
