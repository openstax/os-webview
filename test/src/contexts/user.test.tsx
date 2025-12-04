import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import useUserContext, {UserContextProvider} from '~/contexts/user';
import * as SDC from '~/contexts/shared-data';
import * as UM from '~/models/usermodel';

function Component() {
    const ctx = useUserContext();

    return <div>{ctx?.userStatus.userInfo.id}</div>;
}

/* eslint-disable camelcase */
const uData = {
    id: 1,
    name: 'Roy Johnson',
    username: 'testuser',
    first_name: 'Roy',
    last_name: 'Johnson'
};

describe('user context', () => {
    beforeAll(() => {
        jest.spyOn(SDC, 'default').mockReturnValue({
            flags: false
        });
    });
    const saveDebug = console.debug;

    beforeEach(() => {console.debug = jest.fn();});
    afterEach(() => {console.debug = saveDebug;});

    it('catches no user info', async () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue({} as unknown as UM.UserModelType);
        render(<UserContextProvider><Component /></UserContextProvider>);
        await waitFor(() => expect(console.debug).toHaveBeenCalledWith('No user info retrieved'));
    });
    it('catches missing pending_verification', async () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(uData as unknown as UM.UserModelType);
        render(<UserContextProvider><Component /></UserContextProvider>);
        await waitFor(() => expect(console.debug).toHaveBeenCalledWith(
            expect.stringContaining('No pending_verification flag'),
            uData
        ));
    });
    it('passes when pending_verification is set', async () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue({
            ...uData,
            pending_verification: false,
            groups: ['Faculty']
         } as unknown as UM.UserModelType);
        render(<UserContextProvider><Component /></UserContextProvider>);
        await screen.findByText('1');
    });
});
