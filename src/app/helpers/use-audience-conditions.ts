import {useEffect, useMemo, useState} from 'react';
import useUserContext from '~/contexts/user';
import type {AccountsUserModel} from '~/models/accounts-model';
import userModelLoader, {UserModelType} from '~/models/usermodel';

const ADMIN_ROLES = ['administrator', 'librarian', 'designer'];

function isAdminRole(role: string | undefined): boolean {
    return Boolean(role && ADMIN_ROLES.includes(role));
}

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

// `undefined` until the viewer is known keeps gating additive: a conditioned
// block appears once we know the audience rather than flashing the anonymous
// variant at a logged-in instructor and swapping it out.
//
// Resolve off `userModel.load()`, not `accountsModel.load()`: the accounts
// promise settles a microtask before `~/contexts/user` maps it and calls
// setData, which really did render `['role:anonymous']` to instructors.
export default function useAudienceConditions(): string[] | undefined {
    const {userModel, isLoggedIn} = useUserContext();
    const [resolved, setResolved] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const markResolved = () => {
            if (!cancelled) {
                setResolved(true);
            }
        };

        userModelLoader.load()?.then(markResolved, markResolved);

        return () => {
            cancelled = true;
        };
    }, []);

    return useMemo(
        () => (resolved ? buildConditions(userModel, isLoggedIn) : undefined),
        [resolved, userModel, isLoggedIn]
    );
}
