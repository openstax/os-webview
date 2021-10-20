import React from 'react';

export default function useFormTarget(afterSubmit) {
    const [submitting, setSubmitting] = React.useState(false);
    const submittingRef = React.useRef(submitting);
    const onLoad = React.useCallback(
        () => {
            if (submittingRef.current) {
                setSubmitting(false);
                if (afterSubmit) {
                    afterSubmit();
                }
            }
        },
        [setSubmitting, afterSubmit, submittingRef]
    );
    const FormTarget = React.useMemo(() => {
        return function FT({id='form-target'}) {
            return (
                <iframe
                    name={id} id={id} className="hidden"
                    src="" width="0" height="0" tabIndex="-1" onLoad={onLoad}
                />
            );
        };
    }, [onLoad]);

    submittingRef.current = submitting;

    function onSubmit() {
        setSubmitting(true);
    }

    return {onSubmit, submitting, FormTarget};
}
