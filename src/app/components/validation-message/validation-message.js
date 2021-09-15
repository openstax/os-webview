import React from 'react';

function matchesOrContainsValidationMessage(el) {
    return el?.validationMessage || el?.querySelector(':invalid')?.validationMessage;
}

export default function ValidationMessage({el, hidden, customValidation = () => null}) {
    if (hidden) {
        return null;
    }

    const validationMessage = matchesOrContainsValidationMessage(el) || customValidation();

    return (
        <div className="invalid-message">{validationMessage}</div>
    );
}
