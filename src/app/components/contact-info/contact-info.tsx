import React from 'react';
import FormInput from '~/components/form-input/form-input';
import {useIntl} from 'react-intl';
import SchoolSelector from '~/components/school-selector/school-selector';
import './contact-info.scss';

export default function ContactInfo({
    children
}: React.PropsWithChildren<Record<never, never>>) {
    const {formatMessage} = useIntl();

    return (
        <div className="contact-info">
            <FormInput
                label={formatMessage({id: 'contact-info.first-name'})}
                inputProps={{
                    type: 'text',
                    name: 'first_name',
                    required: true,
                    autocomplete: 'given-name',
                    maxlength: 35
                }}
            />
            <FormInput
                label={formatMessage({id: 'contact-info.last-name'})}
                inputProps={{
                    type: 'text',
                    name: 'last_name',
                    required: true,
                    autocomplete: 'family-name',
                    maxlength: 35
                }}
            />
            <FormInput
                label={formatMessage({id: 'contact-info.email'})}
                inputProps={{
                    type: 'email',
                    name: 'email',
                    required: true,
                    autocomplete: 'email',
                    maxlength: 64
                }}
            />
            <FormInput
                label={formatMessage({id: 'contact-info.phone'})}
                inputProps={{
                    type: 'tel',
                    name: 'phone',
                    required: true,
                    autocomplete: 'tel-national',
                    minlength: 9,
                    maxlength: 20,
                    pattern: '[^a-zA-Z]{9,20}'
                }}
            />
            <SchoolSelector />
            {children}
        </div>
    );
}
