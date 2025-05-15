import React from 'react';
import useSalesforceContext from '~/contexts/salesforce';

type FormParams = React.PropsWithChildren<{
    postTo: string;
    afterSubmit: () => void;
}>;

function SfForm({children, postTo, afterSubmit}: FormParams) {
    const [listening, setListening] = React.useState(false);
    const {debug, oid} = useSalesforceContext();
    const onSubmit = React.useCallback(() => setListening(true), []);
    const onLoad = React.useCallback(() => {
        if (listening) {
            setListening(false);
            afterSubmit();
        }
    }, [listening, afterSubmit]);

    return (
        <React.Fragment>
            <iframe
                name="form-response"
                id="form-response"
                className="hidden"
                src=""
                width="0"
                height="0"
                tabIndex={-1}
                onLoad={onLoad}
            />
            <form
                acceptCharset="UTF-8"
                className="form"
                target={debug ? undefined : 'form-response'}
                action={postTo}
                method="post"
                onSubmit={onSubmit}
                encType="multipart/form-data"
                name="salesforce-form"
            >
                <input type="hidden" name="orgid" value={oid} />
                {debug && <input type="hidden" name="debug" value="1" />}
                <div className="form-content">{children}</div>
            </form>
        </React.Fragment>
    );
}

export default function SfFormOrLoading(formParams: FormParams) {
    const {oid} = useSalesforceContext();

    if (!oid) {
        return <div>Loading...</div>;
    }

    return <SfForm {...formParams} />;
}
