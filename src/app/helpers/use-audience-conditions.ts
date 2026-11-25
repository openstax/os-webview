import {useMemo} from 'react';
import useUserContext from '~/contexts/user';
import {usePersonalization} from '~/contexts/personalization';
import type {AccountsUserModel} from '~/models/accounts-model';
import type {UserModelType} from '~/models/usermodel';

const ADMIN_ROLES = ['administrator', 'librarian', 'designer'];

function isAdminRole(role: string | undefined): boolean {
    return Boolean(role && ADMIN_ROLES.includes(role));
}

// Accounts-derived fallback for when sfapi personalization is unavailable.
function buildConditions(userModel: Partial<UserModelType> | undefined, isLoggedIn: boolean): string[] {
    const accounts: Partial<AccountsUserModel> = userModel?.accountsModel ?? {};
    const facultyVerified = accounts.faculty_status === 'confirmed_faculty';
    const checks: Array<[string, boolean]> = [
        ['role:anonymous', !isLoggedIn],
        ['role:student', accounts.self_reported_role === 'student'],
        ['role:instructor', facultyVerified],
        ['role:admin', isAdminRole(accounts.self_reported_role)],
        ['status:verified', facultyVerified],
        ['status:pending', Boolean(userModel?.pendingInstructorAccess)],
        ['school:assignable', accounts.assignable_school_integrated === true],
        ['adopter:yes', accounts.using_openstax === true]
    ];

    return checks.filter(([, matches]) => matches).map(([slug]) => slug);
}

const ANONYMOUS = ['role:anonymous'];

// `undefined` while personalization loads keeps gating additive: a conditioned
// block appears once we know the audience rather than flashing the anonymous
// variant at a logged-in instructor and swapping it out.
export default function useAudienceConditions(): string[] | undefined {
    const {userModel, isLoggedIn} = useUserContext();
    const {status, data} = usePersonalization();

    return useMemo(() => {
        switch (status) {
            case 'anonymous':
                return ANONYMOUS;
            case 'ready':
                return data?.segments;
            case 'error':
                return buildConditions(userModel, isLoggedIn);
            default:
                return undefined;
        }
    }, [status, data, userModel, isLoggedIn]);
}
