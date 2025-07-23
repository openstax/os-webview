import React from 'react';

export default function useFormTarget(afterSubmit?: () => void) {
    const [submitting, setSubmitting] = React.useState(false);
    // So onLoad is not redefined with every update of submitting
    const submittingRef = React.useRef(submitting);

    submittingRef.current = submitting;

    const onLoad = React.useCallback(() => {
        if (submittingRef.current) {
            setSubmitting(false);
            afterSubmit?.();
        }
    }, [afterSubmit]);
    const FormTarget = React.useCallback(
        ({id = 'form-target'}) => (
            <iframe
                name={id}
                id={id}
                className="hidden"
                src=""
                width="0"
                height="0"
                tabIndex={-1}
                onLoad={onLoad}
            />
        ),
        [onLoad]
    );
    const onSubmit = React.useCallback(() => setSubmitting(true), []);

    return {onSubmit, submitting, FormTarget};
}
