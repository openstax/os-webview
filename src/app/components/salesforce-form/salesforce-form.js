import React from 'react';
import useSalesforceContext from '~/contexts/salesforce';

export function HiddenFields({leadSource}) {
    const {oid, debug} = useSalesforceContext();

    if (!oid) {
        return (<div>Loading...</div>);
    }
    return (
        <React.Fragment>
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="Application_Source__c" value="OS Web" />
            <input type="hidden" name="oid" value={oid} />
            {
                debug && <input type="hidden" name="debug" value="1" />
            }
            <input type="hidden" name="lead_source" value={leadSource} />
        </React.Fragment>
    );
}

function SfForm({children, postTo, afterSubmit}) {
    const [listening, setListening] = React.useState(false);
    const {webtocaseUrl, debug, oid} = useSalesforceContext();
    const onSubmit = React.useCallback(
        () => setListening(true),
        []
    );
    const onLoad = React.useCallback(
        () => {
            if (listening && afterSubmit) {
                setListening(false);
                afterSubmit();
            }
        },
        [listening, afterSubmit]
    );

    return (
        <React.Fragment>
            <iframe
                name="form-response" id="form-response" className="hidden"
                src="" width="0" height="0" tabIndex="-1" onLoad={onLoad}
            />
            <form
                acceptCharset="UTF-8" className="form"
                target={debug ? undefined : 'form-response'}
                action={postTo || webtocaseUrl} method="post"
                onSubmit={onSubmit}
                encType="multipart/form-data"
            >
                <input type="hidden" name="orgid" value={oid} />
                {
                    debug &&
                        <input type="hidden" name="debug" value="1" />
                }
                <div className="form-content">
                    {children}
                </div>
            </form>
        </React.Fragment>
    );
}

export default function SfFormOrLoading(formParams) {
    const {webtocaseUrl} = useSalesforceContext();

    if (!webtocaseUrl) {
        return (<div>Loading...</div>);
    }

    return (<SfForm {...formParams} />);
}
