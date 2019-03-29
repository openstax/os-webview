import settings from 'settings';

const docUrlBase = `${settings.apiOrigin}/apps/cms/api/documents`;
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
        const proxyPromise = new Promise((resolve) => {
            const handleError = (err) => {
                console.warn('Error fetching', this.url, err);
                resolve({});
            };

            if (Date.now() > this[LOADED_TIME] + CACHE_FOR_MS) {
                this[LOADED] = fetch(this.url, {credentials: 'include'}).then((response) => response.json());
            }
            this[LOADED].then(
                (response) => resolve(response),
                handleError
            ).catch(
                handleError
            );
        });

        return proxyPromise;
    }

    loginLink(returnTo) {
        const encodedLocation = encodeURIComponent(returnTo || window.location.href);

        return `${settings.apiOrigin}/oxauth/login/?next=${encodedLocation}`;
    }

}

function oldUserModel(sfUserModel) {
    const findPreferredEmail = (contacts) => (contacts
        .filter((obj) => obj.type === 'EmailAddress')
        .reduce((a, b) => {
            if (b.is_guessed_preferred || (b.is_verified && !a.is_verified)) {
                return b;
            }
            return a;
        }) || {}).value;
    const groupsFor = (userInfo) => {
        const result = (userInfo.applications || [])
            .map((obj) => obj.name)
            .filter((name) => name === 'OpenStax Tutor');

        if (userInfo.self_reported_role === 'student') {
            result.push('Student');
        }
        if (userInfo.faculty_status === 'confirmed_faculty') {
            result.push('Faculty');
        }
        return result;
    };

    /* eslint camelcase: 0 */
    return {
        id: sfUserModel.id,
        accounts_id: sfUserModel.id,
        email: (sfUserModel.contact_infos || []).length ? findPreferredEmail(sfUserModel.contact_infos) : null,
        first_name: sfUserModel.first_name,
        groups: groupsFor(sfUserModel),
        last_name: sfUserModel.last_name,
        pending_verification: sfUserModel.faculty_status === 'pending_faculty',
        username: sfUserModel.id
    };
}

class ConvertedAccountsUserModel extends UserModel {

    constructor() {
        super(accountsUrl);
    }

    load() {
        return super.load().then(oldUserModel);
    }

}

export const accountsModel = new UserModel(accountsUrl);
export const makeDocModel = (docId) => new UserModel(`${docUrlBase}/${docId}`);
export default new ConvertedAccountsUserModel();
