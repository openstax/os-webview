import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import LoginMenuWithDropdown from
    '~/layouts/default/header/menus/main-menu/login-menu/login-menu-with-dropdown';
import * as UUC from '~/contexts/user';
import linkHelper from '~/helpers/link';

const ACCOUNT_HREF = 'https://dev.openstax.org/accounts';
const PROFILE_LINK = `${ACCOUNT_HREF}/profile`;

jest.mock('~/contexts/portal', () => ({
    __esModule: true,
    default: () => ({portalPrefix: ''})
}));

type UserModelOverrides = {
    first_name?: string;
    instructorEligible?: boolean;
    incompleteSignup?: boolean;
    pendingInstructorAccess?: boolean;
    emailUnverified?: boolean;
};

function baseUserModel(overrides: UserModelOverrides = {}) {
    return {
        first_name: 'Roy',
        last_name: 'Johnson',
        username: 'royj',
        instructorEligible: false,
        incompleteSignup: false,
        pendingInstructorAccess: false,
        emailUnverified: false,
        ...overrides
    };
}

function renderMenu(userModel: ReturnType<typeof baseUserModel>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(UUC, 'default').mockReturnValue({userModel} as any);

    return render(
        <MemoryRouter initialEntries={['/']}>
            <ul><LoginMenuWithDropdown /></ul>
        </MemoryRouter>
    );
}

describe('LoginMenuWithDropdown', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('greets the user by first name', () => {
        renderMenu(baseUserModel());

        expect(screen.getByText('Hi Roy')).toBeInTheDocument();
    });

    it('falls back to the username when first_name is absent', () => {
        renderMenu(baseUserModel({first_name: undefined}));

        expect(screen.getByText('Hi royj')).toBeInTheDocument();
    });

    it('always shows a Log out link carrying the return-URL param', () => {
        renderMenu(baseUserModel());

        const link = screen.getByRole('link', {name: 'Log out'});

        expect(link.getAttribute('href')).toBe(linkHelper.logoutLink());
        expect(link.getAttribute('href')).toContain('?r=');
    });

    it('always links to the account profile', () => {
        renderMenu(baseUserModel());

        expect(screen.getByRole('link', {name: 'Account Profile'})
        ).toHaveAttribute('href', PROFILE_LINK);
    });

    const stateItems = [
        {
            flag: 'instructorEligible' as const,
            label: 'Request instructor access',
            href: `${ACCOUNT_HREF}/i/signup/educator/cs_form`
        },
        {flag: 'incompleteSignup' as const, label: 'Complete your profile', href: PROFILE_LINK},
        {flag: 'pendingInstructorAccess' as const, label: 'Pending instructor access', href: PROFILE_LINK},
        {flag: 'emailUnverified' as const, label: 'Verify your email address', href: PROFILE_LINK}
    ];

    describe.each(stateItems)('$label', ({flag, label, href}) => {
        it(`appears only when ${flag} is set, leaving the other items untouched`, () => {
            renderMenu(baseUserModel({[flag]: true}));

            expect(screen.getByRole('link', {name: label})).toHaveAttribute('href', href);
            stateItems
                .filter((other) => other.flag !== flag)
                .forEach((other) => {
                    expect(screen.queryByRole('link', {name: other.label})).toBeNull();
                });
        });

        it(`is absent when ${flag} is not set`, () => {
            renderMenu(baseUserModel({[flag]: false}));

            expect(screen.queryByRole('link', {name: label})).toBeNull();
        });
    });
});
