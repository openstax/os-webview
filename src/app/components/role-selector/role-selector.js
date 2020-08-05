import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Select from '~/components/select/select.jsx';
import './role-selector.css';

function RoleSelector({data: options, value, setValue, children, hidden=false}) {
    const [studentContent, facultyContent] = children;

    function onChangeSubject(event) {
        setValue(event.target.value);
    }

    return (
        <div className="role-selector">
            <form data-region="selector">
                <label hidden={hidden}>
                    I am a
                    <Select name="subject" onChange={onChangeSubject} placeholder="Please select one">
                        {
                            options.map((opt) =>
                                <option
                                    value={opt.salesforce_name}
                                    selected={value === opt.salesforce_name}
                                    key={opt.salesforce_name}
                                >
                                    {opt.display_name}
                                </option>
                            )
                        }
                    </Select>
                </label>
            </form>
            {value === 'Student' && studentContent}
            {!['', 'Student'].includes(value) && facultyContent}
        </div>
    );
}

export default function RoleSelectorLoader(props) {
    return (
        <LoaderPage slug="snippets/roles" props={props} Child={RoleSelector} />
    );
}
