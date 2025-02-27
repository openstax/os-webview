import settings from '~/helpers/window-settings';

const accountsUrl = `${settings().accountHref}/api/user`;

function cached<T>(fn: () => T, invalidateFn: () => void) {
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
        invalidateFn();
        valid = false;
    };
    return cachedFn;
}

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

        window._OX_USER_PROMISE ||= fetch(accountsUrl, { credentials: 'include' }).then(
            (response) => {
                if (response.ok) {
                    return response.json().catch((error) => {
                        throw new Error(`Failed to parse user JSON: ${error.message}`);
                    });
                } else {
                    throw new Error(`Failed to load user: HTTP ${response.status} status code`);
                }
            }
        );

        return window._OX_USER_PROMISE.then((user) => {
            window.dataLayer ||= [];
            window.dataLayer.push({
                faculty_status: user.faculty_status
            });
            return user;
        });
    }, () => { window._OX_USER_PROMISE = undefined; })
};
