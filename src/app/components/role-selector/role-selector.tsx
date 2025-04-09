import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import {FormattedMessage, useIntl} from 'react-intl';
import useLanguageContext from '~/contexts/language';
import './role-selector.scss';

export type Option = {
    displayName: string;
    salesforceName: string;
}

export function RoleDropdown({ options, setValue, name = 'subject' }: {
    options: Option[];
    setValue: (v: string) => void;
    name?: string;
}) {
    const optionsAsOptions = options.map((opt: Option) => ({
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

type Props = {
    value: string;
    setValue: (v: string) => void;
    hidden?: boolean;
    children: React.ReactNode[];
}

/* eslint-disable */
function RoleSelector({
    data: options,
    value,
    setValue,
    children,
    hidden
}: {
    data: Option[];
} & Props) {
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

export default function RoleSelectorLoader(props: Props) {
    const {language} = useLanguageContext();

    return (
        <LoaderPage slug={`snippets/roles?locale=${language}`} props={props} Child={RoleSelector} />
    );
}
