import React from 'react';
import {render, screen} from '@testing-library/preact';
import useAccount from '~/helpers/use-account';
import * as UUC from '~/contexts/user';

/* eslint-disable camelcase */
const userModel = {
    id: 16249,
    accounts_id: 16249,
    uuid: '3a2789ae-eced-483f-a7ff-246988e074be',
    email: 'rej2+verify.1@rice.edu',
    first_name: 'Roy',
    groups: [],
    last_name: 'Johnson',
    instructorEligible: true,
    pending_verification: false,
    incompleteSignup: false,
    pendingInstructorAccess: false,
    emailUnverified: false,
    username: 16249,
    self_reported_role: 'instructor',
    self_reported_school: 'Test University',
    is_not_gdpr_location: false,
    salesforce_contact_id: '0034C00000X7g1ZQAR',
    accountsModel: {
        id: 16249,
        username: 'roynonfaculty',
        name: 'Roy Johnson',
        first_name: 'Roy',
        last_name: 'Johnson',
        full_name: 'Roy Johnson',
        title: '',
        uuid: '3a2789ae-eced-483f-a7ff-246988e074be',
        is_not_gdpr_location: false,
        is_test: false,
        using_openstax: false,
        salesforce_contact_id: '0034C00000X7g1ZQAR',
        faculty_status: 'no_faculty_info',
        self_reported_role: 'instructor',
        self_reported_school: 'Test University',
        school_name: 'Test University',
        school_type: 'college',
        school_location: 'domestic_school',
        is_administrator: true,
        contact_infos: [
            {
                id: 910,
                type: 'EmailAddress',
                value: 'rej2+verify.1@rice.edu',
                is_verified: true,
                is_guessed_preferred: true
            },
            {
                id: 943,
                type: 'EmailAddress',
                value: 'roy.e.johnson@gmail.com',
                is_verified: true,
                is_guessed_preferred: false
            },
            {
                id: 184,
                type: 'EmailAddress',
                value: 'rej2+1@rice.edu',
                is_verified: true,
                is_guessed_preferred: false
            }
        ],
        signed_contract_names: ['general_terms_of_use', 'privacy_policy'],
        external_ids: [],
        assignable_user: false
    }
};
const myOpenStaxUser = {
    contact: {
        firstName: 'Roy',
        lastName: 'Johnson'
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
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
