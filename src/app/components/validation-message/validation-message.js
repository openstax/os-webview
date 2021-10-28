import React from 'react';

function matchesOrContainsValidationMessage(el) {
    return el?.validationMessage || el?.querySelector(':invalid')?.validationMessage;
}

export function OldValidationMessage({el, hidden, customValidation = () => null}) {
    if (hidden) {
        return null;
    }

    const validationMessage = matchesOrContainsValidationMessage(el) || customValidation();

    return (
        <div className="invalid-message">{validationMessage}</div>
    );
}

// watchValue changes trigger updates
// elementRef will be queryied for invalid elements
export default function ValidationMessage({watchValue, elementRef}) {
    const [validationMessage, setValidationMessage] = React.useState('');

    React.useEffect(
        () => setValidationMessage(
            matchesOrContainsValidationMessage(elementRef.current)
        ),
        [watchValue, elementRef, setValidationMessage]
    );

    return (
        <div className="invalid-message">{validationMessage}</div>
    );
}
