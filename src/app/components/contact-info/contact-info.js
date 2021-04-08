import React, {useState} from 'react';
import FormInput from '~/components/form-input/form-input';
import schoolPromise from '~/models/schools';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ReactModal from 'react-modal';
import shellBus from '~/components/shell/shell-bus';
import './contact-info.scss';

const message = 'Please enter your full school name without abbreviations.' +
    ' If this is your full school name, you can click Next.';

export default function ContactInfo({validatorRef}) {
    const [schoolIsOk, setSchoolIsOk] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const schools = useDataFromPromise(schoolPromise, []).sort();
    const schoolSet = new window.Set(schools.map((s) => s.toLowerCase()));

    React.useEffect(() => {
        shellBus.emit(showPopup ? 'with-modal' : 'no-modal');

        return () => shellBus.emit('no-modal');
    }, [showPopup]);

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
        <div className="contact-info">
            <FormInput
                label="First name"
                inputProps={{
                    type: 'text',
                    name: 'first_name',
                    required: true,
                    autocomplete: 'given-name'
                }}
            />
            <FormInput
                label="Last name"
                inputProps={{
                    type: 'text',
                    name: 'last_name',
                    required: true,
                    autocomplete: 'family-name'
                }}
            />
            <FormInput
                label="Email address"
                inputProps={{
                    type: 'email',
                    name: 'email',
                    required: true,
                    autocomplete: 'email'
                }}
            />
            <FormInput
                label="Phone number"
                inputProps={{
                    type: 'text',
                    name: 'phone',
                    required: true,
                    autocomplete: 'tel-national'
                }}
            />
            <FormInput
                label="School name"
                suggestions={schools}
                inputProps={{
                    type: 'text',
                    name: 'company',
                    required: true,
                    autocomplete: 'off',
                    onChange
                }}
            />
            <ReactModal
                isOpen={showPopup}
                className="modal contact-info-modal" overlayClassName="modal-overlay"
            >
                <p id="popupMessage">{message}</p>
                <button type="button" className="dismiss" tabIndex="1" onClick={onClose}>
                    Got it
                </button>
            </ReactModal>
        </div>
    );
}
