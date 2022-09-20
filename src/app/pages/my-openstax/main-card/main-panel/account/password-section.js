import React, { useState, useEffect } from 'react';
import { TextInput } from '../common';

function usePasswordItem({ label }) {
    const [value, updateValue] = useState('');
    const onChange = React.useCallback(
        (event) => updateValue(event.target.value),
        []
    );

    return {
        label,
        value,
        updateValue,
        onChange
    };
}

export default function PasswordSection() {
    const [saving, updateSaving] = useState(false);
    const [message, updateMessage] = useState('');
    const passwordItems = React.useMemo(
        () => [
            {
                label: 'Current password'
            },
            {
                label: 'New password'
            },
            {
                label: 'Verify new password'
            }
        ].map(usePasswordItem),
        []
    );
    const allHaveValues = React.useMemo(
        () => passwordItems.every((item) => item.value.length >= 8),
        [passwordItems]
    );
    const canSave = React.useMemo(
        () => (!saving &&
            allHaveValues &&
            passwordItems[1].value === passwordItems[2].value &&
            passwordItems[0].value !== passwordItems[1].value),
        [saving, passwordItems, allHaveValues]
    );
    const save = React.useCallback(
        () => {
            updateSaving(true);
            window.setTimeout(() => {
                updateSaving(false);
                updateMessage('Your password was saved successfully');
                passwordItems.forEach((item) => item.updateValue(''));
            }, 300);
        },
        [passwordItems]
    );

    useEffect(() => {
        if (passwordItems[0].value.length > 0) {
            updateMessage('');
        }
    }, [passwordItems]);

    return (
        <section>
            <h3>Password</h3>
            <div className='fields password-fields'>
                {
                    passwordItems.map((item) =>
                        <TextInput type='password' {...item} key={item.label} />
                    )
                }
            </div>
            <div className='button-and-message'>
                <button type='submit' disabled={!canSave} onClick={save}>Change password</button>
                <div className='message'>{message}</div>
            </div>
        </section>
    );
}
