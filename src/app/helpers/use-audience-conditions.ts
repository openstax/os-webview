import {useEffect, useMemo, useState} from 'react';
import useUserContext from '~/contexts/user';
import accountsModel, {AccountsUserModel} from '~/models/accounts-model';
import type {UserModelType} from '~/models/usermodel';

const ADMIN_ROLES = ['administrator', 'librarian', 'designer'];

function isAdminRole(role: string | undefined): boolean {
    return Boolean(role && ADMIN_ROLES.includes(role));
}

// Slug vocabulary for flex-page block `rendering_condition`s. Keep this list, the
// underlying checks, and the "Audience gating" section of CLAUDE.md in sync -
// that table is the single source of truth for CMS editors and contributors.
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

// Returns the audience slugs that apply to the current viewer, or `undefined`
// until we know who they are. `accountsModel.load()` is memoized, so this never
// triggers its own network request - it just observes the shared promise that
// `~/contexts/user` already kicked off.
//
// `undefined` while unresolved (rather than an early `['role:anonymous']`) keeps
// personalization purely additive: unconditioned blocks always render, and a
// conditioned block only appears once we actually know the viewer's audience.
// Emitting `role:anonymous` immediately would show anonymous content to a
// logged-in instructor for a moment and then swap it out - a flash of wrong
// content plus a double layout shift.
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

        accountsModel.load()?.then(markResolved, markResolved);

        return () => {
            cancelled = true;
        };
    }, []);

    return useMemo(
        () => (resolved ? buildConditions(userModel, isLoggedIn) : undefined),
        [resolved, userModel, isLoggedIn]
    );
}
