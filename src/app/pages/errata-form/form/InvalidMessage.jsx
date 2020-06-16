import React, {useState, useEffect} from 'react';

/**
 * Creates an InvalidMessage component that is bound to a form input element
 * @returns a pair of items:
 * The message component, and a function that updates the message
 * It is important that the ref item exist when the message item is created
 */

function InvalidMessage({message}) {
    return (
        <span className="invalid-message">{message}</span>
    );
}

export default function (inputRef) {
    const [message, updateMessage] = useState('');
    const updateFromRef = () => {
        if (inputRef.current) {
            updateMessage(inputRef.current.validationMessage);
        } else {
            console.warn('No current ref', inputRef);
        }
    };

    useEffect(updateFromRef, [inputRef]);

    return [
        () => <InvalidMessage message={message} />,
        updateFromRef
    ];
}
