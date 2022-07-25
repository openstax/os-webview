import {useState, useEffect} from 'react';
import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';

const settings = window.SETTINGS;
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
        //     id: 10060116,
        //     name: 'Roy Johnson',
        //     first_name: 'Roy',
        //     last_name: 'Johnson',
        //     full_name: 'Roy Johnson',
        //     uuid: '53cdf5b7-6dd9-45a5-bad7-e1f5532180e2',
        //     support_identifier: 'cs_5bcab9be',
        //     is_not_gdpr_location: true,
        //     opt_out_of_cookies: false,
        //     using_openstax: false,
        //     salesforce_contact_id: '0037h00000SEXNqAAP',
        //     // May be confirmed_faculty, rejected_by_sheerid, incomplete_signup
        //     faculty_status: 'confirmed_faculty',
        //     is_newflow: true,
        //     is_instructor_verification_stale: false,
        //     needs_complete_edu_profile: false,
        //     self_reported_role: 'instructor',
        //     self_reported_school: '',
        //     school_type: 'college',
        //     school_location: 'domestic_school',
        //     is_kip: false,
        //     is_administrator: false,
        //     grant_tutor_access: false,
        //     contact_infos: [
        //         {
        //             id: 61694,
        //             type: 'EmailAddress',
        //             value: 'rej2+mos1@rice.edu',
        //             is_verified: true,
        //             is_guessed_preferred: true
        //         }
        //     ],
        //     applications: [
        //         {
        //             id: 5,
        //             name: 'OpenStax CMS Dev'
        //         }
        //     ]
        // });
        // eslint-disable-next-line no-unreachable
        return fetch(accountsUrl, {credentials: 'include'})
            .then(
                (response) => {
                    return response.json().then(
                        (result) => {
                            if (window.dataLayer) {
                                window.dataLayer.push({
                                    faculty_status: result.faculty_status
                                });
                            }
                            return result;
                        },
                        (err) => {
                            console.warn('No JSON in Accounts response');
                            return {err};
                        }
                    );
                },
                (err) => {
                    console.warn('"Error fetching user info"');
                    return {err};
                }
            )
            .catch((err) => {throw new Error(`Unable to fetch user data: ${err}`);})
        ;
    })
};

// eslint-disable-next-line complexity
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
    const isVerificationStale = !isStudent && sfUserModel.is_instructor_verification_stale;
    const isVerificationPending = !isStudent &&
        ['pending_faculty'].includes(sfUserModel.faculty_status) &&
        !isVerificationStale;
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
    // // May be confirmed_faculty, rejected_by_sheerid, incomplete_signup
    // faculty_status: 'rejected_by_sheerid',
    const pendingInstructorAccess = sfUserModel.faculty_status === 'rejected_by_sheerid';
    const emailUnverified = sfUserModel.faculty_status === 'incomplete_signup';

    /* eslint camelcase: 0 */
    return {
        id: sfUserModel.id,
        accounts_id: sfUserModel.id,
        uuid: sfUserModel.uuid,
        email: (sfUserModel.contact_infos || []).length ? findPreferredEmail(sfUserModel.contact_infos) : null,
        first_name: sfUserModel.first_name,
        groups,
        last_name: sfUserModel.last_name,
        pending_verification: isVerificationPending,
        stale_verification: isVerificationStale,
        needsProfileCompleted: sfUserModel.needs_complete_edu_profile,
        pendingInstructorAccess,
        emailUnverified,
        is_newflow: sfUserModel.is_newflow,
        username: sfUserModel.id,
        renewal_eligible: sfUserModel.renewal_eligible,
        self_reported_role: sfUserModel.self_reported_role,
        self_reported_school: sfUserModel.self_reported_school,
        is_not_gdpr_location: sfUserModel.is_not_gdpr_location,
        salesforce_contact_id: sfUserModel.salesforce_contact_id,
        accountsModel: sfUserModel
    };
}

const userModel = {
    load() {
        return accountsModel.load().then(oldUserModel);
    }
};

const throttledLoginCheck = throttle((setData) => {
    accountsModel.load().then((oldUser) => {
        accountsModel.load.invalidate();
        accountsModel.load().then((newUser) => {
            if (!isEqual(oldUser, newUser)) {
                userModel.load().then(setData);
            }
        });
    });
}, 20000);

function useUserModel() {
    const [data, setData] = useState();

    useEffect(() => {
        const check = () => throttledLoginCheck(setData);

        window.addEventListener('focus', check);
        userModel.load().then(setData);

        return () => window.removeEventListener('focus', check);
    }, []);

    return data;
}

export default userModel;
export {accountsModel, useUserModel};
