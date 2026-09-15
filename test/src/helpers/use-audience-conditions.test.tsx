import React from 'react';
import {render, screen} from '@testing-library/preact';
import useAudienceConditions from '~/helpers/use-audience-conditions';
import * as UUC from '~/contexts/user';
import accountsModel from '~/models/accounts-model';
import userModel from '../data/userModel';

/* eslint-disable @typescript-eslint/no-explicit-any, camelcase */

function Component() {
    const conditions = useAudienceConditions();

    return (
        <div data-testid="conditions">
            {conditions === undefined ? 'unresolved' : JSON.stringify(conditions)}
        </div>
    );
}

function mockUserContext(value: Record<string, unknown>) {
    jest.spyOn(UUC, 'default').mockReturnValue(value as any);
}

describe('useAudienceConditions', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('stays undefined until the accounts fetch resolves, then resolves to role:anonymous', async () => {
        let resolveLoad: () => void = () => undefined;
        const pending = new Promise((resolve) => {
            resolveLoad = () => resolve({});
        });

        jest.spyOn(accountsModel, 'load').mockReturnValue(pending as any);
        mockUserContext({isLoggedIn: false});

        render(<Component />);
        expect(screen.getByTestId('conditions').textContent).toBe('unresolved');

        resolveLoad();
        await screen.findByText('["role:anonymous"]');
    });

    it('does not render a conditioned consumer while unresolved (returns undefined, not an empty set)', () => {
        jest.spyOn(accountsModel, 'load').mockReturnValue(new Promise(() => undefined) as any);
        mockUserContext({isLoggedIn: false});

        render(<Component />);
        expect(screen.getByTestId('conditions').textContent).toBe('unresolved');
    });

    it('returns only role:anonymous when logged out', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({isLoggedIn: false});

        render(<Component />);
        await screen.findByText('["role:anonymous"]');
    });

    it('includes role:instructor and status:verified for confirmed faculty', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({
            isLoggedIn: true,
            userModel: {
                ...userModel,
                accountsModel: {
                    ...userModel.accountsModel,
                    faculty_status: 'confirmed_faculty',
                    self_reported_role: 'instructor'
                }
            }
        });

        render(<Component />);
        const el = await screen.findByTestId('conditions');
        const conditions = JSON.parse(el.textContent || '[]');

        expect(conditions).toEqual(expect.arrayContaining(['role:instructor', 'status:verified']));
        expect(conditions).not.toContain('role:anonymous');
    });

    it('includes role:admin for a self-declared administrator', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({
            isLoggedIn: true,
            userModel: {
                ...userModel,
                accountsModel: {
                    ...userModel.accountsModel,
                    faculty_status: 'no_faculty_info',
                    self_reported_role: 'administrator'
                }
            }
        });

        render(<Component />);
        const el = await screen.findByTestId('conditions');
        const conditions = JSON.parse(el.textContent || '[]');

        expect(conditions).toContain('role:admin');
        expect(conditions).not.toContain('role:instructor');
    });

    it('includes school:assignable when assignable_school_integrated is true', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({
            isLoggedIn: true,
            userModel: {
                ...userModel,
                accountsModel: {
                    ...userModel.accountsModel,
                    assignable_school_integrated: true
                }
            }
        });

        render(<Component />);
        const el = await screen.findByTestId('conditions');
        const conditions = JSON.parse(el.textContent || '[]');

        expect(conditions).toContain('school:assignable');
    });

    it('includes adopter:yes when using_openstax is true', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({
            isLoggedIn: true,
            userModel: {
                ...userModel,
                accountsModel: {
                    ...userModel.accountsModel,
                    using_openstax: true
                }
            }
        });

        render(<Component />);
        const el = await screen.findByTestId('conditions');
        const conditions = JSON.parse(el.textContent || '[]');

        expect(conditions).toContain('adopter:yes');
    });

    it('includes status:pending when pendingInstructorAccess is true', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({
            isLoggedIn: true,
            userModel: {
                ...userModel,
                pendingInstructorAccess: true
            }
        });

        render(<Component />);
        const el = await screen.findByTestId('conditions');
        const conditions = JSON.parse(el.textContent || '[]');

        expect(conditions).toContain('status:pending');
    });

    it('matches several slugs at once for a confirmed-faculty self-declared administrator', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({
            isLoggedIn: true,
            userModel: {
                ...userModel,
                accountsModel: {
                    ...userModel.accountsModel,
                    faculty_status: 'confirmed_faculty',
                    self_reported_role: 'administrator',
                    assignable_school_integrated: true
                }
            }
        });

        render(<Component />);
        const el = await screen.findByTestId('conditions');
        const conditions = JSON.parse(el.textContent || '[]');

        expect(conditions.sort()).toEqual(
            ['role:admin', 'role:instructor', 'school:assignable', 'status:verified'].sort()
        );
    });

    it('does not blow up when accountsModel is missing from userModel', async () => {
        jest.spyOn(accountsModel, 'load').mockResolvedValue({} as any);
        mockUserContext({isLoggedIn: true, userModel: {...userModel, accountsModel: undefined}});

        render(<Component />);
        const el = await screen.findByTestId('conditions');

        expect(el.textContent).toBe('[]');
    });

    it('does not update state after unmounting before the accounts fetch resolves', async () => {
        let resolveLoad: () => void = () => undefined;
        const pending = new Promise((resolve) => {
            resolveLoad = () => resolve({});
        });

        jest.spyOn(accountsModel, 'load').mockReturnValue(pending as any);
        mockUserContext({isLoggedIn: false});

        const {unmount} = render(<Component />);

        unmount();
        resolveLoad();
        await pending;
    });

    it('resolves even when the accounts fetch rejects', async () => {
        jest.spyOn(accountsModel, 'load').mockReturnValue(Promise.reject(new Error('nope')) as any);
        mockUserContext({isLoggedIn: false});

        render(<Component />);
        await screen.findByText('["role:anonymous"]');
    });
});
