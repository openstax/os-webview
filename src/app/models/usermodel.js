import settings from 'settings';

export const userUrl = `${settings.apiOrigin}/api/user`;
const docUrlBase = `${settings.apiOrigin}/api/documents`;
const accountsUrl = `${settings.accountHref}/api/user`;

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

const _sfUserModel = new UserModel(accountsUrl); // loads multiple times
const _userModel = new UserModel(userUrl).load(); // loads once

export const sfUserModel = {
    load: () =>
        Promise.all([_sfUserModel.load(), _userModel]).then(([sfUser, user]) => {
            /* eslint camelcase: 0 */
            return Object.assign(user, {
                pending_verification: sfUser.faculty_status === 'pending_faculty'
            });
        }),
    loginLink: _sfUserModel.loginLink
};
export const accountsModel = new UserModel(accountsUrl);
export const makeDocModel = (docId) => new UserModel(`${docUrlBase}/${docId}`);
export default new UserModel(userUrl);
