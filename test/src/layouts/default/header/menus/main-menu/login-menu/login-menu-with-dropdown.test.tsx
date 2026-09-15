import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import LoginMenuWithDropdown from
    '~/layouts/default/header/menus/main-menu/login-menu/login-menu-with-dropdown';
import * as UUC from '~/contexts/user';
import * as UM from '~/models/usermodel';
import * as SDC from '~/contexts/shared-data';
import * as SF from '~/models/sfapi';
import {UserContextProvider} from '~/contexts/user';
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

function renderMenu(
    userModel: ReturnType<typeof baseUserModel>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    myOpenStaxUser: any = {error: 'not loaded'}
) {
    jest.spyOn(UUC, 'default').mockReturnValue({
        userModel,
        myOpenStaxUser
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

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

    describe('mosIsAvailable', () => {
        it('shows Account Profile (not Dashboard) when unavailable', () => {
            renderMenu(baseUserModel(), {error: 'Not faculty verified'});

            expect(screen.getByRole('link', {name: 'Account Profile'})
            ).toHaveAttribute('href', PROFILE_LINK);
            expect(screen.queryByRole('link', {name: 'Account Dashboard'})).toBeNull();
        });

        it('shows Account Dashboard (not Profile) when available', () => {
            renderMenu(baseUserModel(), {contact: {firstName: 'Roy', lastName: 'Johnson'}});

            expect(screen.getByRole('link', {name: 'Account Dashboard'})
            ).toHaveAttribute('href', '/account');
            expect(screen.queryByRole('link', {name: 'Account Profile'})).toBeNull();
        });
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

    describe('mosIsAvailable across the CMS flag, faculty status, and Salesforce fetch', () => {
        function renderWithRealContext(
            facultyStatus: string,
            myOpenstaxFlag: boolean,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sfResult: any
        ) {
            jest.spyOn(UM, 'useUserModel').mockReturnValue({
                id: 1,
                uuid: 'uuid-1',
                ...baseUserModel(),
                accountsModel: {faculty_status: facultyStatus, contact_infos: []}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            jest.spyOn(SDC, 'default').mockReturnValue({
                flags: {my_openstax: myOpenstaxFlag}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            jest.spyOn(SF, 'default').mockResolvedValue(sfResult);

            return render(
                <MemoryRouter initialEntries={['/']}>
                    <UserContextProvider>
                        <ul><LoginMenuWithDropdown /></ul>
                    </UserContextProvider>
                </MemoryRouter>
            );
        }

        it('shows Account Profile when the CMS my_openstax flag is off', async () => {
            renderWithRealContext('confirmed_faculty', false, {contact: {}});

            expect(await screen.findByRole('link', {name: 'Account Profile'})).toBeInTheDocument();
        });

        it('shows Account Profile when the flag is on but faculty status is not confirmed', async () => {
            renderWithRealContext('no_faculty_info', true, {contact: {}});

            expect(await screen.findByRole('link', {name: 'Account Profile'})).toBeInTheDocument();
        });

        it('shows Account Dashboard once the flag, faculty status, and SF fetch all line up', async () => {
            renderWithRealContext('confirmed_faculty', true, {
                contact: {firstName: 'Roy', lastName: 'Johnson'}
            });

            expect(await screen.findByRole('link', {name: 'Account Dashboard'})).toBeInTheDocument();
        });
    });
});
