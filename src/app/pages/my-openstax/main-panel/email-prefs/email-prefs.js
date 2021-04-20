import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import './email-prefs.scss';
import { useStoreon } from 'storeon/preact';

const PAUSE_BEFORE_FADE = 5000;

function useMessageInfo(savedTime) {
    const [messageClass, updateMessageClass] = useState('');

    function setMessageClass() {
        const showStatus = savedTime && Date.now() - savedTime < PAUSE_BEFORE_FADE;

        if (savedTime && showStatus) {
            updateMessageClass('');
            window.setTimeout(setMessageClass, PAUSE_BEFORE_FADE);
        } else {
            updateMessageClass('fadeout');
        }
    }

    setMessageClass();

    return {
        message: savedTime ? 'Saved' : '',
        messageClass
    };
}

function Checkbox({ item }) {
    const { dispatch } = useStoreon('emailPrefs');
    const { label, selected: checked, saved } = item;
    const id = `${label}-label`;
    const { message, messageClass } = useMessageInfo(saved);

    function toggle() {
        dispatch('emailPrefs/update', {
            item,
            selected: !checked
        });
    }
    function toggleByKey(event) {
        if (['Enter', ' '].includes(event.key)) {
            toggle();
            event.preventDefault();
        }
    }

    return (
        <div className='labeled-checkbox'>
            <span
                className='checkbox' role='checkbox' aria-checked={checked}
                tabIndex='0' aria-labelledby={id} onClick={toggle}
                onKeyDown={toggleByKey}
            >
                {
                    checked &&
                    <FontAwesomeIcon icon={faCheck} />
                }
            </span>
            <label id={id}>{label}</label>
            <div className={`message ${messageClass}`}>{message}</div>
        </div>
    );
}

export default function EmailPrefs() {
    const { emailPrefs } = useStoreon('emailPrefs');

    return (
        <section id='email-prefs'>
            <h2>Email Preferences</h2>
            <section>
                <h3>General updates</h3>
                {
                    emailPrefs.general.map((item) =>
                        <Checkbox item={item} key={item.label} />
                    )
                }
            </section>
            <section>
                <h3>Subject updates</h3>
                {
                    emailPrefs.subjectUpdates.map((item) =>
                        <Checkbox item={item} key={item.label} />
                    )
                }
            </section>
        </section>
    );
}
