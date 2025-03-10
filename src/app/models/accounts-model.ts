import settings from '~/helpers/window-settings';

const accountsUrl = `${settings().accountHref}/api/user`;

function cached<T>(fn: () => T) {
    let valid = false;
    let cachedResult: T | null = null;
    const cachedFn = function () {
        if (!valid) {
            cachedResult = fn();
            valid = true;
        }
        return cachedResult as T;
    };

    cachedFn.invalidate = () => {
        valid = false;
    };
    return cachedFn;
}

export type SfUserModel = {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    school_name: string;
    self_reported_role: string;
    self_reported_school: string;
    is_not_gdpr_location: boolean;
    salesforce_contact_id: string;
    is_instructor_verification_stale: boolean;
    faculty_status: string;
    contact_infos: {
        type: string;
        value: string;
        is_verified: boolean;
        is_guessed_preferred: boolean;
    }[];
};

export default {
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
        //     faculty_status: 'no_faculty_info',
        //     is_instructor_verification_stale: false,
        //     needs_complete_edu_profile: false,
        //     self_reported_role: 'instructor',
        //     self_reported_school: '',
        //     school_type: 'college',
        //     school_location: 'domestic_school',
        //     is_kip: false,
        //     is_administrator: false,
        //     contact_infos: [
        //         {
        //             id: 61694,
        //             type: 'EmailAddress',
        //             value: 'rej2+mos1@rice.edu',
        //             is_verified: false,
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
        // // eslint-disable-next-line no-unreachable
        return fetch(accountsUrl, {credentials: 'include'}).then(
            (response) => {
                if (response.status === 403) {
                    return {};
                }
                return response.json().then(
                    (result) => {
                        if (
                            'dataLayer' in window &&
                            window.dataLayer instanceof Array
                        ) {
                            window.dataLayer.push({
                                // eslint-disable-next-line camelcase
                                faculty_status: result.faculty_status
                            });
                        }
                        return result as SfUserModel;
                    },
                    (err: unknown) => {
                        console.warn('No JSON in Accounts response');
                        return {err};
                    }
                );
            },
            (err: unknown) => {
                console.warn('"Error fetching user info"');
                return {err};
            }
        );
    })
};
