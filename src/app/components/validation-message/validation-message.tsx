import React from 'react';

export type ElementWithValidationMessage = HTMLElement & {
    validationMessage: string;
};

function matchesOrContainsValidationMessage(el: ElementWithValidationMessage) {
    return (
        el?.validationMessage ||
        el?.querySelector<ElementWithValidationMessage>(':invalid')
            ?.validationMessage ||
        'invalid input'
    );
}

// watchValue changes trigger updates
// elementRef will be queryied for invalid elements
export default function ValidationMessage({
    watchValue,
    elementRef
}: {
    watchValue?: object;
    elementRef: React.MutableRefObject<ElementWithValidationMessage>;
}) {
    const [validationMessage, setValidationMessage] = React.useState('');

    React.useEffect(
        () =>
            setValidationMessage(
                matchesOrContainsValidationMessage(elementRef.current)
            ),
        [watchValue, elementRef, setValidationMessage]
    );

    return <div className="invalid-message">{validationMessage}</div>;
}
