import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import './role-selector.scss';
/* eslint-disable */
function RoleSelector({data: options, value, setValue, children, hidden=false}) {
    const [studentContent, facultyContent] = children;
    const optionsAsOptions = options.map((opt) => (
        {label: opt.displayName, value: opt.salesforceName}
    ));

    return (
        <div className="role-selector">
            <form data-region="selector">
                <label hidden={hidden}>
                    I am a
                    <DropdownSelect
                        name="subject" required
                        options={optionsAsOptions}
                        placeholder="Please select one"
                        onValueUpdate={setValue}
                    />
                </label>
            </form>
            {value === 'Student' && studentContent}
            {!['', undefined, 'Student'].includes(value) && facultyContent}
        </div>
    );
}

export default function RoleSelectorLoader(props) {
    return (
        <LoaderPage slug="snippets/roles" props={props} Child={RoleSelector} />
    );
}
