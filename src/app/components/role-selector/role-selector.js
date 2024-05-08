import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import {FormattedMessage, useIntl} from 'react-intl';
import useLanguageContext from '~/contexts/language';
import './role-selector.scss';

export function RoleDropdown({ options, setValue, name = 'subject' }) {
    const optionsAsOptions = options.map((opt) => ({
        label: opt.displayName,
        value: opt.salesforceName
    }));
    const {formatMessage} = useIntl();

    return (
        <DropdownSelect
            name={name}
            required
            options={optionsAsOptions}
            placeholder={formatMessage({id: 'selector.select-one'})}
            onValueUpdate={setValue}
        />
    );
}

// Jest didn't like dynamic id for formatMessage
const spanishRoles = {
    'Student': 'Estudiante',
    'Faculty': 'Instructor(a)',
    'Home School Teacher': 'Instructor(a) de educación en el hogar',
    'Administrator': 'Administrador(a)',
    'Librarian': 'Bibliotecario',
    'Instructional Designer': 'Diseñador(a) instruccional',
    'Adjunct Faculty': 'Adjunto Facultad',
    'Other': 'Otro'
};

/* eslint-disable */
function RoleSelector({
    data: options,
    value,
    setValue,
    children,
    hidden = false
}) {
    const [studentContent, facultyContent] = children;
    const {language} = useLanguageContext();
    const translatedOptions = options.map(
        (opt) => {
            return {...opt, displayName: language === 'es' && spanishRoles[opt.salesforceName] || opt.displayName};
        }
    );

    return (
        <div className="role-selector">
            <form data-region="selector">
                <label hidden={hidden}>
                    <FormattedMessage id="role-selector.i-am" defaultMessage='I am a' />
                    <RoleDropdown options={translatedOptions} setValue={setValue} />
                </label>
            </form>
            {value === "Student" && studentContent}
            {!["", undefined, "Student"].includes(value) && facultyContent}
        </div>
    );
}

export default function RoleSelectorLoader(props) {
    return (
        <LoaderPage slug="snippets/roles" props={props} Child={RoleSelector} />
    );
}
