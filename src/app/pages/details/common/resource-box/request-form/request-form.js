import React, {useState} from 'react';
import SalesforceForm from '~/components/salesforce-form/salesforce-form';
import useSalesforceContext from '~/contexts/salesforce';
import useUserContext from '~/contexts/user';
import './request-form.scss';

function RequestForm({model, done, afterSubmit}) {
    const {userStatus} = useUserContext();
    const {webtocaseUrl} = useSalesforceContext();
    const [count, setCount] = useState();

    function onCountChange(event) {
        setCount(event.target.value);
    }

    if (!userStatus || !webtocaseUrl) {
        return null;
    }
    const {salesforceAbbreviation, title, coverUrl} = model.bookModel;
    const description = `iBooks comp request for ${salesforceAbbreviation}
Student count ${count}`;

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
            </div>
            <SalesforceForm postTo={webtocaseUrl} afterSubmit={afterSubmit}>
                <div>
                    <input type="hidden" name="external" value="1" />
                    <input type="hidden" name="Product__c" value="Textbook" />
                    <input type="hidden" name="Feature__c" value="Comp" />
                    <input type="hidden" name="subject" value="Comp request" />
                    <input
                        type="hidden" name="name"
                        value={`${userStatus.firstName} ${userStatus.lastName}`}
                    />
                    <input type="hidden" name="email" value={userStatus.email} />
                    <input type="hidden" name="description" value={description} />
                    How many students will be using {title} this semester?
                    <div className="hint">
                        Include sections taught by any teaching assistants that you supervise.
                    </div>
                    <input type="number" min="0" required value={count} onChange={onCountChange} />
                </div>
                {
                    model.notAvailable ?
                        <div>This title is not available</div> :
                        <div className="button-row">
                            <button
                                className="primary"
                                disabled={!salesforceAbbreviation}
                            >
                                Request iBooks edition
                            </button>
                            <button type="reset" onClick={done}>Cancel</button>
                        </div>
                }
            </SalesforceForm>
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
                    We&apos;ll send you an email shortly with your download code.
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
