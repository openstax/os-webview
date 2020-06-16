import React, {useState, useRef} from 'react';
import {salesforceLoadedState, salesforce} from '~/models/salesforce';

function SfForm({children, postTo = salesforce.webtoleadUrl, oid, afterSubmit}) {
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

    console.info('Should have action of', postTo);

    return (
        <React.Fragment>
            <iframe name="form-response" id="form-response" className="hidden"
                src="" width="0" height="0" tabindex="-1" onLoad={onLoad} />
            <form accept-charset="UTF-8" className="form" target="form-response"
                action={postTo} method="post"
                onSubmit={onSubmit}
            >
                <input type="hidden" name="orgid" value={salesforce.oid} />
                <div className="form-content">
                    {children}
                </div>
            </form>
        </React.Fragment>
    );
}

export default function SalesforceForm({postTo, ...otherProps}) {
    console.info('Updated postTo', postTo);
    const sfLoaded = salesforceLoadedState();

    if (!sfLoaded) {
        return (<div>Loading</div>);
    }

    return <SfForm postTo={postTo} {...otherProps} />;
}
