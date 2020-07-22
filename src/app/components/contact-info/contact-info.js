import React, {useState} from 'react';
import FormInput from '~/components/form-input/form-input.jsx';
import schoolPromise from '~/models/schools';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {WrappedPopupJsx} from '~/components/popup/popup.jsx';

const message = 'Please enter your full school name without abbreviations.' +
    ' If this is your full school name, you can click Next.';

export default function ({validatorRef}) {
    const [schoolIsOk, setSchoolIsOk] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const schools = useDataFromPromise(schoolPromise, []).sort();
    const schoolSet = new Set(schools.map((s) => s.toLowerCase()));

    if (validatorRef) {
        validatorRef.current = function validate() {
            if (!schoolIsOk) {
                setShowPopup(true);
                return false;
            }
            return true;
        };
    }

    function onChange(event) {
        setSchoolIsOk(schoolSet.has(event.target.value.toLowerCase()));
    }
    function onClose() {
        setSchoolIsOk(true);
        setShowPopup(false);
    }

    return (
        <div>
            <FormInput label="First name"
                inputProps={{
                    type: 'text',
                    name: 'first_name',
                    required: true,
                    autocomplete: 'given-name'
                }}
            />
            <FormInput label="Last name"
                inputProps={{
                    type: 'text',
                    name: 'last_name',
                    required: true,
                    autocomplete: 'family-name'
                }}
            />
            <FormInput label="Email address"
                inputProps={{
                    type: 'email',
                    name: 'email',
                    required: true,
                    autocomplete: 'email'
                }}
            />
            <FormInput label="Phone number"
                inputProps={{
                    type: 'text',
                    name: 'phone',
                    required: true,
                    autocomplete: 'tel-national'
                }}
            />
            <FormInput label="School name"
                suggestions={schools}
                inputProps={{
                    type: 'text',
                    name: 'company',
                    required: true,
                    autocomplete: 'off',
                    onChange
                }}
            />
            {
                showPopup &&
                    <WrappedPopupJsx message={message} onClose={onClose} />
            }
        </div>
    );
}
