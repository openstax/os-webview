import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import jsonized from './jsonized';
import {useUserModel} from '~/models/usermodel';

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('usermodel', () => {
    jest.useFakeTimers();
    function Component() {
        const data = useUserModel();

        return <div>{data.first_name}</div>;
    }
    /* eslint-disable camelcase */
    it('runs throttled login check each time window focuses', async () => {
        mockFetch
            .mockResolvedValueOnce(
                jsonized({
                    first_name: 'Nobody',
                    uuid: 'one',
                    contact_infos: [],
                    self_reported_role: 'student'
                })
            )
            .mockResolvedValue(
                jsonized({
                    id: 10060116,
                    uuid: 'two',
                    name: 'Roy Johnson',
                    first_name: 'Roy',
                    last_name: 'Johnson',
                    full_name: 'Roy Johnson',
                    self_reported_role: 'faculty',
                    faculty_status: 'confirmed_faculty',
                    contact_infos: [
                        {
                            id: 61694,
                            type: 'EmailAddress',
                            value: 'rej2+mos1@rice.edu',
                            is_verified: false,
                            is_guessed_preferred: true
                        }
                    ]
                })
            );
        render(<Component />);
        jest.runAllTimers();
        fireEvent.focus(window);
        await screen.findByText('Roy');
        // Exercise the user-didn't-change branch of throttledLoginCheck
        jest.runAllTimers();
        fireEvent.focus(window);
        await screen.findByText('Roy');
    });
    it('handles empty contact_infos', async () => {
        mockFetch.mockResolvedValue(
            jsonized({
                id: 10060116,
                uuid: 'two',
                name: 'Roy Johnson',
                first_name: 'Roy',
                last_name: 'Johnson',
                full_name: 'Roy Johnson',
                contact_infos: [],
                self_reported_role: 'student'
            })
        );
        render(<Component />);
        fireEvent.focus(window);
        await screen.findByText('Roy');
        jest.runAllTimers();
        fireEvent.focus(window);
        await screen.findByText('Roy');
    });
    it('handles pending verification', async () => {
        mockFetch.mockResolvedValue(
            jsonized({
                id: 10060116,
                uuid: 'two',
                name: 'Roy Johnson',
                first_name: 'Roy',
                last_name: 'Johnson',
                full_name: 'Roy Johnson',
                is_instructor_verification_stale: false,
                contact_infos: [
                    {
                        type: 'not an email'
                    },
                    {
                        id: 61694,
                        type: 'EmailAddress',
                        value: 'rej2+mos1@rice.edu',
                        is_verified: false,
                        is_guessed_preferred: false
                    },
                    {
                        id: 61695,
                        type: 'EmailAddress',
                        value: 'rej2+1@rice.edu',
                        is_verified: true,
                        is_guessed_preferred: false
                    },
                    {
                        id: 61696,
                        type: 'EmailAddress',
                        value: 'rej2@rice.edu',
                        is_verified: true,
                        is_guessed_preferred: true
                    },
                    {
                        id: 61697,
                        type: 'EmailAddress',
                        value: 'rej2+mos1@rice.edu',
                        is_verified: false,
                        is_guessed_preferred: false
                    }
                ],
                self_reported_role: 'faculty',
                faculty_status: 'pending_faculty'
            })
        );
        render(<Component />);
        fireEvent.focus(window);
        jest.runAllTimers();
        await screen.findByText('Roy');
    });
});
