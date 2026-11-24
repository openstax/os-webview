import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import useAudienceConditions from '~/helpers/use-audience-conditions';
import * as UUC from '~/contexts/user';
import {UserContextProvider} from '~/contexts/user';
import * as PC from '~/contexts/personalization';
import {PersonalizationContextProvider} from '~/contexts/personalization';
import {clearPersonalizationCache} from '~/models/personalization';
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

function mockPersonalization(status: string, data?: object) {
    jest.spyOn(PC, 'usePersonalization').mockReturnValue({
        status,
        data,
        has: () => false
    } as any);
}

async function renderedConditions() {
    render(<Component />);
    const el = await screen.findByTestId('conditions');

    return JSON.parse(el.textContent || 'null');
}

describe('useAudienceConditions', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('stays undefined while personalization is loading', () => {
        mockUserContext({isLoggedIn: false});
        mockPersonalization('loading');

        render(<Component />);
        expect(screen.getByTestId('conditions').textContent).toBe('unresolved');
    });

    it('returns role:anonymous for an anonymous visitor', async () => {
        mockUserContext({isLoggedIn: false});
        mockPersonalization('anonymous');

        expect(await renderedConditions()).toEqual(['role:anonymous']);
    });

    it('returns the sfapi segments when ready', async () => {
        mockUserContext({isLoggedIn: true, userModel});
        mockPersonalization('ready', {
            v: 1,
            audience: 'instructor',
            segments: ['adopter:current', 'role:instructor', 'status:verified']
        });

        expect(await renderedConditions()).toEqual([
            'adopter:current',
            'role:instructor',
            'status:verified'
        ]);
    });

    describe('when personalization fails, deriving segments from Accounts', () => {
        beforeEach(() => {
            mockPersonalization('error');
        });

        it('returns only role:anonymous when logged out', async () => {
            mockUserContext({isLoggedIn: false});

            expect(await renderedConditions()).toEqual(['role:anonymous']);
        });

        it('includes role:instructor and status:verified for confirmed faculty', async () => {
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

            const conditions = await renderedConditions();

            expect(conditions).toEqual(expect.arrayContaining(['role:instructor', 'status:verified']));
            expect(conditions).not.toContain('role:anonymous');
        });

        it('includes role:admin for a self-declared administrator', async () => {
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

            const conditions = await renderedConditions();

            expect(conditions).toContain('role:admin');
            expect(conditions).not.toContain('role:instructor');
        });

        it('includes school:assignable when assignable_school_integrated is true', async () => {
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

            expect(await renderedConditions()).toContain('school:assignable');
        });

        it('includes adopter:yes when using_openstax is true', async () => {
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

            expect(await renderedConditions()).toContain('adopter:yes');
        });

        it('includes status:pending when pendingInstructorAccess is true', async () => {
            mockUserContext({
                isLoggedIn: true,
                userModel: {...userModel, pendingInstructorAccess: true}
            });

            expect(await renderedConditions()).toContain('status:pending');
        });

        it('matches several slugs at once for a confirmed-faculty self-declared administrator', async () => {
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

            expect((await renderedConditions()).sort()).toEqual(
                ['role:admin', 'role:instructor', 'school:assignable', 'status:verified'].sort()
            );
        });

        it('does not blow up when accountsModel is missing from userModel', async () => {
            mockUserContext({isLoggedIn: true, userModel: {...userModel, accountsModel: undefined}});

            expect(await renderedConditions()).toEqual([]);
        });
    });
});

// Mounts the real providers, not mocked contexts: a mock cannot reproduce the
// ordering this guards against.
describe('useAudienceConditions resolution ordering', () => {
    const confirmedFaculty = {
        id: 1,
        uuid: 'u-1',
        first_name: 'A',
        last_name: 'B',
        faculty_status: 'confirmed_faculty',
        self_reported_role: 'instructor',
        using_openstax: true,
        contact_infos: [
            {type: 'EmailAddress', value: 'a@b.c', is_verified: true, is_guessed_preferred: true}
        ],
        applications: []
    };

    function renderProbe(seen: (string[] | undefined)[]) {
        function Probe() {
            seen.push(useAudienceConditions());
            return null;
        }

        render(
            <UserContextProvider>
                <PersonalizationContextProvider>
                    <Probe />
                </PersonalizationContextProvider>
            </UserContextProvider>
        );
    }

    beforeEach(() => {
        clearPersonalizationCache();
        sessionStorage.clear();
    });

    it('never emits role:anonymous to a logged-in instructor', async () => {
        const seen: (string[] | undefined)[] = [];
        const saveFetch = global.fetch;
        let release: (v: unknown) => void = () => undefined;

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({v: 1, segments: ['role:instructor', 'status:verified']})
        });
        (window as any)._OX_USER_PROMISE = new Promise((resolve) => {
            release = resolve;
        });

        renderProbe(seen);
        release(confirmedFaculty);

        await waitFor(() =>
            expect(seen.some((c) => c?.includes('role:instructor'))).toBe(true)
        );
        expect(seen.filter((c) => c?.includes('role:anonymous'))).toHaveLength(0);
        global.fetch = saveFetch;
    });
});
