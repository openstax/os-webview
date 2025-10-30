import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import mockLocalStorage from '../../helpers/mock-local-storage';
import fundraiserData from './data/fundraiser.json';
import TakeOverDialogGateKeeper from '~/layouts/default/takeover-dialog/takeover-dialog';
import MemoryRouter from '../../../helpers/future-memory-router';
import {Link} from 'react-router-dom';

describe('layouts/default/takeover-dialog', () => {
    const saveFetch = global.fetch;
    const saveGoalTime = fundraiserData[0].goal_time;
    const futureGoalTime = saveGoalTime.replace('2025', '2045');

    function fetchResponse(data: object) {
        return Promise.resolve({
            json: () => Promise.resolve(data)
        });
    }

    function Component() {
        return (
            <MemoryRouter initialEntries={['/']}>
                <TakeOverDialogGateKeeper />
                <Link to="/other">Change route</Link>
            </MemoryRouter>
        );
    }

    beforeAll(() => {
        global.fetch = jest
            .fn()
            .mockImplementation((...args: Parameters<typeof saveFetch>) => {
                const url = args[0] as string;

                if (url.endsWith('/fundraiser/?format=json')) {
                    return fetchResponse(fundraiserData);
                }
                // console.info('*** Fetch args:', args);
                return saveFetch(...args);
            });
        // Ensure goal has not passed
        fundraiserData[0].goal_time = futureGoalTime; // eslint-disable-line camelcase
    });

    it('renders when localStorage is disabled', async () => {
        mockLocalStorage.getItem.mockImplementation(() => {
            throw new Error('prohibited');
        });
        render(<Component />);
        expect(
            await screen.findAllByRole('heading', {
                level: 1,
                name: 'Congratulations, OpenStax Class of 2025!'
            })
        ).toHaveLength(2);
    });
    it('renders when nothing is in localStorage', async () => {
        mockLocalStorage.getItem.mockReturnValue(undefined);
        render(<Component />);
        expect(
            await screen.findAllByRole('heading', {
                level: 1,
                name: 'Congratulations, OpenStax Class of 2025!'
            })
        ).toHaveLength(2);
        mockLocalStorage.getItem.mockReturnValue('"stored-value"');
    });
    it('does not render when goal has passed', async () => {
        fundraiserData[0].goal_time = saveGoalTime; // eslint-disable-line camelcase
        render(<Component />);
        await expect(
            screen.findByRole('heading', {level: 1})
        ).rejects.toThrow();
    });
    it('renders when goal is unset', async () => {
        fundraiserData[0].goal_time = ''; // eslint-disable-line camelcase
        render(<Component />);
        expect(
            await screen.findAllByRole('heading', {
                level: 1,
                name: 'Congratulations, OpenStax Class of 2025!'
            })
        ).toHaveLength(2);
        // Should close when location changes
        fireEvent.click(screen.getByText('Change route'));
        await expect(
            screen.findByRole('heading', {level: 1})
        ).rejects.toThrow();
    });
    it('renders a goal box', async () => {
        jest.useFakeTimers();
        fundraiserData[0].message_type = 'goal'; // eslint-disable-line camelcase
        fundraiserData[0].goal_amount = 45; // eslint-disable-line camelcase
        render(<Component />);
        expect(await screen.findAllByText('our goal is to raise')).toHaveLength(
            2
        );
        // exercises useHMS routine in common.tsx
        jest.advanceTimersByTime(100);
        jest.advanceTimersByTime(1100);
    });
    it('handles invalid message_type', async () => {
        fundraiserData[0].message_type = 'oops'; // eslint-disable-line camelcase
        render(<Component />);
        const oopsHeader = (
            await screen.findAllByRole('heading', {level: 1})
        )[1];

        expect(oopsHeader.textContent).toBe('OOPS, oops');
    });
});
