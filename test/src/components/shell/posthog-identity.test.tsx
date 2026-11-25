import React from 'react';
import {render} from '@testing-library/preact';
import * as UC from '~/contexts/user';
import * as PC from '~/contexts/personalization';
import * as PH from '~/helpers/posthog';
import PostHogIdentity from '~/components/shell/posthog-identity';

/* eslint-disable @typescript-eslint/no-explicit-any */
const posthog = {
    identify: jest.fn(),
    setPersonProperties: jest.fn(),
    reset: jest.fn(),
    'get_property': jest.fn()
};
const mockUser = jest.spyOn(UC, 'default');
const mockPersonalization = jest.spyOn(PC, 'default');

jest.spyOn(PH, 'whenPostHogLoads').mockImplementation((callback: any) => {
    callback(posthog);
    return () => undefined;
});

const stored = {v: 1, audience: 'instructor', segments: ['role:instructor']};
const fetched = {
    ...stored,
    'first_name': 'Roy',
    school: {id: '001', name: 'Rice University', type: null, 'assignable_stage': null}
};

function setState(uuid: string | undefined, status: string, data?: object, userLoaded = true) {
    mockUser.mockReturnValue({uuid, userLoaded} as any);
    mockPersonalization.mockReturnValue({status, data, has: () => false} as any);
}

describe('PostHogIdentity', () => {
    beforeEach(() => Object.values(posthog).forEach((fn) => fn.mockClear()));

    it('identifies by uuid and sets audience, segments and school, never the name', () => {
        setState('user-1', 'ready', fetched);
        render(<PostHogIdentity />);

        expect(posthog.identify).toHaveBeenCalledWith('user-1');
        expect(posthog.setPersonProperties).toHaveBeenCalledWith({
            audience: 'instructor',
            segments: ['role:instructor'],
            school: 'Rice University'
        });
    });

    it('leaves school alone while only the stored fields are known', () => {
        setState('user-1', 'ready', stored);
        render(<PostHogIdentity />);

        expect(posthog.setPersonProperties).toHaveBeenCalledWith({
            audience: 'instructor',
            segments: ['role:instructor']
        });
    });

    it('sets school to null for a visitor sfapi has no school for', () => {
        setState('user-1', 'ready', {...fetched, school: null});
        render(<PostHogIdentity />);

        expect(posthog.setPersonProperties).toHaveBeenCalledWith({
            audience: 'instructor',
            segments: ['role:instructor'],
            school: null
        });
    });

    it('identifies once while personalization loads, then adds the properties', () => {
        setState('user-1', 'loading');
        const {rerender} = render(<PostHogIdentity />);

        expect(posthog.setPersonProperties).not.toHaveBeenCalled();
        setState('user-1', 'ready', fetched);
        rerender(<PostHogIdentity />);

        expect(posthog.identify).toHaveBeenCalledTimes(1);
        expect(posthog.setPersonProperties).toHaveBeenCalledTimes(1);
    });

    it('leaves an already-anonymous PostHog identity alone', () => {
        posthog.get_property.mockReturnValue('anonymous');
        setState(undefined, 'anonymous');
        render(<PostHogIdentity />);

        expect(posthog.identify).not.toHaveBeenCalled();
        expect(posthog.reset).not.toHaveBeenCalled();
    });

    it('waits for Accounts before deciding the visitor is anonymous', () => {
        posthog.get_property.mockReturnValue('identified');
        setState(undefined, 'loading', undefined, false);
        render(<PostHogIdentity />);

        expect(posthog.reset).not.toHaveBeenCalled();
    });

    it('clears an identity PostHog kept from an expired session', () => {
        posthog.get_property.mockReturnValue('identified');
        setState(undefined, 'anonymous');
        render(<PostHogIdentity />);

        expect(posthog.get_property).toHaveBeenCalledWith('$user_state');
        expect(posthog.reset).toHaveBeenCalledTimes(1);
    });

    it('resets the identity on logout', () => {
        setState('user-1', 'ready', fetched);
        const {rerender} = render(<PostHogIdentity />);

        posthog.get_property.mockReturnValue('identified');
        setState(undefined, 'anonymous');
        rerender(<PostHogIdentity />);

        expect(posthog.reset).toHaveBeenCalledTimes(1);
    });
});
