import {useState, useEffect} from 'react';
import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';
import accountsModel from './accounts-model';
import type {AccountsUserModel} from '../../typings/accounts';

export type UserModelType = {
    id: number;
    accounts_id: number;
    uuid: string;
    email?: string;
    first_name: string;
    groups: string[];
    last_name: string;
    instructorEligible: boolean;
    pending_verification: boolean;
    stale_verification: boolean;
    incompleteSignup: boolean;
    pendingInstructorAccess: boolean;
    emailUnverified: boolean;
    username: number;
    self_reported_role: string;
    self_reported_school: string;
    is_not_gdpr_location: boolean;
    salesforce_contact_id: string;
    accountsModel: AccountsUserModel;
};

// eslint-disable-next-line complexity
function oldUserModel(accountsUserModel: AccountsUserModel) {
    if (!('id' in accountsUserModel)) {
        return {};
    }
    const findPreferredEmail = (
        contacts: UserModelType['accountsModel']['contact_infos']
    ) =>
        contacts
            .filter((obj) => obj.type === 'EmailAddress')
            .reduce((a, b) => {
                if (
                    b.is_guessed_preferred ||
                    (b.is_verified && !a.is_verified)
                ) {
                    return b;
                }
                return a;
            }).value;
    const isStudent = ['student', 'unknown_role'].includes(
        accountsUserModel.self_reported_role
    );
    const isVerificationStale =
        !isStudent && accountsUserModel.is_instructor_verification_stale;
    const isVerificationPending =
        !isStudent &&
        ['pending_faculty'].includes(accountsUserModel.faculty_status) &&
        !isVerificationStale;
    const groups = (function () {
        const result = [];

        if (isStudent) {
            result.push('Student');
        }
        if (accountsUserModel.faculty_status === 'confirmed_faculty') {
            result.push('Faculty');
        }
        return result;
    })();
    // // May be confirmed_faculty, rejected_by_sheerid, incomplete_signup
    // faculty_status: 'rejected_by_sheerid',
    const pendingInstructorAccess = [
        'rejected_by_sheerid',
        'pending_faculty'
    ].includes(accountsUserModel.faculty_status);
    const incompleteSignup = accountsUserModel.faculty_status === 'incomplete_signup';
    const emailUnverified = !accountsUserModel.contact_infos.some(
        (i) => i.is_verified
    );
    const instructorEligible = accountsUserModel.faculty_status === 'no_faculty_info';

    /* eslint camelcase: 0 */
    return {
        id: accountsUserModel.id,
        accounts_id: accountsUserModel.id,
        uuid: accountsUserModel.uuid,
        email: accountsUserModel.contact_infos.length
            ? findPreferredEmail(accountsUserModel.contact_infos)
            : undefined,
        first_name: accountsUserModel.first_name,
        groups,
        last_name: accountsUserModel.last_name,
        instructorEligible,
        pending_verification: isVerificationPending,
        stale_verification: isVerificationStale,
        incompleteSignup,
        pendingInstructorAccess,
        emailUnverified,
        username: accountsUserModel.id,
        self_reported_role: accountsUserModel.self_reported_role,
        self_reported_school: accountsUserModel.self_reported_school,
        is_not_gdpr_location: accountsUserModel.is_not_gdpr_location,
        salesforce_contact_id: accountsUserModel.salesforce_contact_id,
        accountsModel: accountsUserModel
    } as const;
}

const userModel = {
    load() {
        return accountsModel
            .load()
            ?.then((accountsUserModel) => oldUserModel(accountsUserModel as AccountsUserModel));
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
    const [data, setData] = useState<Partial<UserModelType>>({});

    useEffect(() => {
        const check = () => throttledLoginCheck(setData);

        window.addEventListener('focus', check);
        userModel.load().then(setData);

        return () => window.removeEventListener('focus', check);
    }, []);

    return data as UserModelType;
}

export default userModel;
export {useUserModel};
