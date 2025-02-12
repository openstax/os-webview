import React from 'react';
import {render, screen} from '@testing-library/preact';
import useAccount from '~/helpers/use-account';
import * as UUC from '~/contexts/user';
import userModel from '../data/userModel';

const myOpenStaxUser = {
    contact: {
        firstName: 'Roy',
        lastName: 'Johnson'
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any, camelcase*/
describe('useAccount', () => {
    function Component() {
        const {firstName, lastName} = useAccount() as any;

        return <div>{firstName ?? 'whoops'}{' '}{lastName}</div>;
    }

    it('pulls the data', () => {
        jest.spyOn(UUC, 'default').mockReturnValue({userModel, myOpenStaxUser} as any);
        render(<Component />);
        screen.getByText('Roy Johnson');
    });
    it('does not pull data if no userModel', () => {
        jest.spyOn(UUC, 'default').mockReturnValue({myOpenStaxUser} as any);

        render(<Component />);
        screen.getByText('whoops');
    });
    it('warns when user error', () => {
        const saveWarn = console.warn;

        console.warn = jest.fn();
        jest.spyOn(UUC, 'default').mockReturnValue({
            userModel,
            myOpenStaxUser: {error: 'humbug'}
        } as any);

        render(<Component />);
        screen.getByText('whoops');
        expect(console.warn).toHaveBeenCalled();
        console.warn = saveWarn;
    });
    it('pulls the data when faculty_status is not defined', () => {
        userModel.accountsModel.faculty_status = undefined as any;
        userModel.accountsModel.contact_infos = undefined as any;
        jest.spyOn(UUC, 'default').mockReturnValue({userModel, myOpenStaxUser} as any);
        render(<Component />);
        screen.getByText('Roy Johnson');
    });
});
