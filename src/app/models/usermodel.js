import settings from 'settings';
import $ from '~/helpers/$';
import bus from './usermodel-bus';
import isEqual from 'lodash/isEqual';

const docUrlBase = `${$.apiOriginAndPrefix}/documents`;
const accountsUrl = `${settings.accountHref}/api/user`;

function cached(fn) {
    let valid = false;
    let cachedResult = null;
    const cachedFn = function () {
        if (!valid) {
            cachedResult = fn();
            valid = true;
        }
        return cachedResult;
    };

    cachedFn.invalidate = () => {
        valid = false;
    };
    return cachedFn;
}

const accountsModel = {
    load: cached(() => {
        // Uncomment ONLY to TEST
        // return Promise.resolve({
        //     id: 315605,
        //     name: "Roy2 Johnson",
        //     first_name: "Roy2",
        //     last_name: "Johnson",
        //     full_name: "Roy2 Johnson",
        //     uuid: "fca73689-fc4d-4369-bc46-ad6e02b9a13b",
        //     support_identifier: "cs_fce9a9e8",
        //     is_test: false,
        //     faculty_status: "pending_faculty",
        //     self_reported_role: "student",
        //     self_reported_school: "Rice U",
        //     school_type: "unknown_school_type",
        //     contact_infos: [
        //         {
        //             id: 312328,
        //             type: "EmailAddress",
        //             value: "rej2+2@rice.edu",
        //             is_verified: true,
        //             is_guessed_preferred: true
        //         }
        //     ],
        //     applications: [
        //         // {name: 'OpenStax Tutor'}
        //     ]
        // });
        return fetch(accountsUrl, {credentials: 'include'})
            .then(
                (response) => {
                    response.json().then((result) => {
                        if (window.dataLayer) {
                            window.dataLayer.push({
                                faculty_status: result.faculty_status
                            });
                        }
                    });
                    return response.json();
                },
                (err) => {
                    console.warn('"Error fetching user info"');
                    return {err};
                }
            );
    })
};

function oldUserModel(sfUserModel) {
    if (!('id' in sfUserModel)) {
        return {};
    }
    const findPreferredEmail = (contacts) => (contacts
        .filter((obj) => obj.type === 'EmailAddress')
        .reduce((a, b) => {
            if (b.is_guessed_preferred || (b.is_verified && !a.is_verified)) {
                return b;
            }
            return a;
        }) || {}).value;
    const isStudent = ['student', 'unknown_role'].includes(sfUserModel.self_reported_role);
    const pending = !isStudent &&
        ['pending_faculty', 'no_faculty_info'].includes(sfUserModel.faculty_status);
    const groups = (function () {
        const result = (sfUserModel.applications || [])
            .map((obj) => obj.name)
            .filter((name) => name === 'OpenStax Tutor');

        if (isStudent) {
            result.push('Student');
        }
        if (sfUserModel.faculty_status === 'confirmed_faculty') {
            result.push('Faculty');
        }
        return result;
    })();

    /* eslint camelcase: 0 */
    return {
        id: sfUserModel.id,
        accounts_id: sfUserModel.id,
        email: (sfUserModel.contact_infos || []).length ? findPreferredEmail(sfUserModel.contact_infos) : null,
        first_name: sfUserModel.first_name,
        groups,
        last_name: sfUserModel.last_name,
        pending_verification: pending,
        username: sfUserModel.id,
        self_reported_role: sfUserModel.self_reported_role,
        is_not_gdpr_location: sfUserModel.is_not_gdpr_location
    };
}

window.addEventListener('focus', () => {
    accountsModel.load().then((oldUser) => {
        accountsModel.load.invalidate();
        accountsModel.load().then((newUser) => {
            if (!isEqual(oldUser, newUser)) {
                bus.emit('update-userModel', newUser);
                bus.emit('update-accountsModel', oldUserModel(newUser));
            }
        });
    });
});

const userModel = {
    load() {
        return accountsModel.load().then(oldUserModel);
    }
};
const makeDocModel = (docId) => new UserModel(`${docUrlBase}/${docId}`);

bus.serve('userModel-load', () => userModel.load());
bus.serve('accountsModel-load', () => accountsModel.load());

export default userModel;
export {accountsModel, makeDocModel};
