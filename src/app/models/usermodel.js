import settings from 'settings';

const userUrl = `${settings.apiOrigin}/api/user`;
const sfUserUrl = `${settings.apiOrigin}/api/user_salesforce`;

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
export default new UserModel(userUrl);
