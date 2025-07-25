import React from 'react';

export type ElementWithValidationMessage = HTMLElement & {
    validationMessage: string;
};

// eslint-disable-next-line complexity
function matchesOrContainsValidationMessage(el: ElementWithValidationMessage) {
    const containsInvalid =
        el?.querySelector<ElementWithValidationMessage>(':invalid');

    return el?.validationMessage || containsInvalid
        ? containsInvalid?.validationMessage || 'invalid input'
        : '';
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
