import React, {useState, useRef} from 'react';
import {useSalesforceLoadedState, salesforce} from '~/models/salesforce';

function SfForm({children, postTo = salesforce.webtoleadUrl, afterSubmit}) {
    const [listening, setListening] = useState(false);

    function onSubmit() {
        setListening(true);
    }

    function onLoad() {
        if (listening && afterSubmit) {
            setListening(false);
            afterSubmit();
        }
    }

    return (
        <React.Fragment>
            <iframe name="form-response" id="form-response" className="hidden"
                src="" width="0" height="0" tabindex="-1" onLoad={onLoad} />
            <form accept-charset="UTF-8" className="form"
                target={salesforce.debug ? undefined : 'form-response'}
                action={postTo} method="post"
                onSubmit={onSubmit}
            >
                <input type="hidden" name="orgid" value={salesforce.oid} />
                {
                    salesforce.debug &&
                        <input type="hidden" name="debug" value="1" />
                }
                <div className="form-content">
                    {children}
                </div>
            </form>
        </React.Fragment>
    );
}

export default function SalesforceForm({postTo, ...otherProps}) {
    const sfLoaded = useSalesforceLoadedState();

    if (!sfLoaded) {
        return (<div>Loading</div>);
    }

    return <SfForm postTo={postTo} {...otherProps} />;
}
