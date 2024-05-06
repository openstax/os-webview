import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import {FormattedMessage, useIntl} from 'react-intl';
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

/* eslint-disable */
function RoleSelector({
    data: options,
    value,
    setValue,
    children,
    hidden = false
}) {
    const [studentContent, facultyContent] = children;

    return (
        <div className="role-selector">
            <form data-region="selector">
                <label hidden={hidden}>
                    <FormattedMessage id="role-selector.i-am" defaultMessage='I am a' />
                    <RoleDropdown options={options} setValue={setValue} />
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
