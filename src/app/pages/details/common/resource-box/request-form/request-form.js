import React, {useState} from 'react';
import {useSalesforceLoadedState, salesforce} from '~/models/salesforce';
import {useUserStatus, usePartnerFeatures} from '../../hooks';
import './request-form.css';

function RequestForm({model, done, afterSubmit}) {
    const userStatus = useUserStatus();
    const sfLoaded = useSalesforceLoadedState();

    function listenForResponse() {
        const iframeEl = document.getElementById('form-response');
        const onLoad = () => {
            iframeEl.removeEventListener('load', onLoad);
            afterSubmit();
        };

        iframeEl.addEventListener('load', onLoad);
    }

    if (!userStatus || !sfLoaded) {
        return null;
    }
    const {salesforceName, title, coverUrl} = model.bookModel;

    return (
        <div className="comp-copy-request-form">
            <div>
                Instructors with a verified account can request a complimentary
                iBooks version of their book.
            </div>
            <div className="book-requested">
                <div className="header">Book requested</div>
                <img src={coverUrl} />
                {title}
                <iframe name="form-response" id="form-response" src="about:blank" width="0" height="0" />
            </div>
            <form
                accept-charset="UTF-8" target="form-response"
                action={salesforce.webtoleadUrl} method="post"
            >
                <div>
                    <input type="hidden" name="utf8" value="✓" />
                    <input type="hidden" name="oid" value={salesforce.oid} />
                    <input type="hidden" name="lead_source" value="Comp Request" />
                    <input type="hidden" name="first_name" value={userStatus.firstName} />
                    <input type="hidden" name="last_name" value={userStatus.lastName} />
                    <input type="hidden" name="email" value={userStatus.email} />
                    <input type="hidden" name="00NU00000053nzR" value={salesforceName} />
                    How many students will be using {title} this semester?
                    <div className="hint">
                        Include sections taught by any teaching assistants that you supervise.
                    </div>
                    <input name="00NU00000052VId" type="number" min="0" required />
                </div>
                {
                    model.notAvailable ?
                        <div>This title is not available</div> :
                        <div className="button-row">
                            <button
                                className="primary"
                                disabled={!salesforceName}
                                onClick={listenForResponse}
                            >
                                Request iBooks edition
                            </button>
                            <button type="reset" onClick={done}>Cancel</button>
                        </div>
                }
            </form>
        </div>
    );
}

function Confirmation({done}) {
    return (
        <div className="comp-copy-request-form">
            <div className="confirmation">
                <div className="confirmation-header">Your request was submitted!</div>
                {' '}
                <div className="confirmation-content">
                    We'll send you an email shortly with your download code.
                </div>
            </div>
            <button type="button" className="primary close-button" onClick={done}>Close</button>
        </div>
    );
}

export default function CompCopyRequestForm({model, done}) {
    const [beforeSubmit, setBeforeSubmit] = useState(true);

    return (
        beforeSubmit ?
            <RequestForm model={model} done={done} afterSubmit={() => setBeforeSubmit(false)} /> :
            <Confirmation done={done} />
    );
}
