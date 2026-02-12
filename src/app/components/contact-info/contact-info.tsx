import React from 'react';
import FormInput from '~/components/form-input/form-input';
import {useIntl} from 'react-intl';
import useUserContext from '~/contexts/user';
import SchoolSelector from '~/components/school-selector/school-selector';
import {useLocation} from 'react-router-dom';
import './contact-info.scss';

export default function ContactInfo({
    children
}: React.PropsWithChildren<Record<never, never>>) {
    const {formatMessage} = useIntl();
    const {userModel} = useUserContext();
    const firstName = userModel?.first_name;
    const lastName = userModel?.last_name;
    const email = userModel?.email;
    const school = userModel?.accountsModel?.school_name;
    const {pathname} = useLocation();
    const phoneRequired = !pathname.endsWith('adoption');

    return (
        <div className="contact-info">
            <FormInput
                label={formatMessage({id: 'contact-info.first-name'})}
                inputProps={{
                    type: 'text',
                    name: 'first_name',
                    required: true,
                    autoComplete: 'given-name',
                    maxLength: 35,
                    value: firstName
                }}
            />
            <FormInput
                label={formatMessage({id: 'contact-info.last-name'})}
                inputProps={{
                    type: 'text',
                    name: 'last_name',
                    required: true,
                    autoComplete: 'family-name',
                    maxLength: 35,
                    value: lastName
                }}
            />
            <FormInput
                label={formatMessage({id: 'contact-info.email'})}
                inputProps={{
                    type: 'email',
                    name: 'email',
                    required: true,
                    autoComplete: 'email',
                    maxLength: 64,
                    value: email
                }}
            />
            <FormInput
                label={formatMessage({id: 'contact-info.phone'})}
                inputProps={{
                    type: 'tel',
                    name: 'phone',
                    required: phoneRequired,
                    autoComplete: 'tel-national',
                    minLength: 9,
                    maxLength: 20,
                    pattern: '[^a-zA-Z]{9,20}'
                }}
            />
            <SchoolSelector initialValue={school} />
            {children}
        </div>
    );
}
