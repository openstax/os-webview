import React, {useState, useRef} from 'react';
import salesforce from '~/models/salesforce';

const defaultPostTo = `https://${salesforce.salesforceHome}/servlet/servlet.WebToCase?encoding=UTF-8`;
const oid = salesforce.oid;

export default function ({children, postTo=defaultPostTo, afterSubmit}) {
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
            <form accept-charset="UTF-8" className="form" target="form-response"
                action={postTo} method="post"
                onSubmit={onSubmit}
            >
                <input type="hidden" name="orgid" value={oid} />
                <div className="form-content">
                    {children}
                </div>
            </form>
        </React.Fragment>
    );
}
