import React, {useState, useRef, useEffect} from 'react';
import SalesforceForm from '~/components/salesforce-form/salesforce-form';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import {useHistory} from 'react-router-dom';

const options = [
    'General',
    'Adopting OpenStax Textbooks',
    'OpenStax Tutor Support',
    'OpenStax Kinetic',
    'OpenStax CNX',
    'Donations',
    'College/University Partnerships',
    'Media Inquiries',
    'Foundational Support',
    'OpenStax Partners',
    'Website',
    'OpenStax Polska'
].map((s) => ({label: s, value: s}));

options[0].selected = true;


function LabeledInputWithInvalidMessage({
    className, children, eventType='input', showMessage
}) {
    const ref = useRef();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const el = ref.current.querySelector('[name]');
        const updateMessage = () => setMessage(el.validationMessage);

        updateMessage();
        el.addEventListener(eventType, updateMessage);
        return () => el.removeEventListener(eventType, updateMessage);
    }, [eventType]);

    return (
        <label ref={ref} className={className}>
            {children}
            {
                showMessage &&
                    <span className="invalid-message">{message}</span>
            }
        </label>
    );
}

export default function ContactForm() {
    const [postTo, setPostTo] = useState();
    const [showInvalidMessages, setShowInvalidMessages] = useState(false);
    const history = useHistory();

    function onChangeSubject(value) {
        const isPolish = value === 'OpenStax Polska';

        setPostTo(isPolish ? '/apps/cms/api/mail/send_mail' : null);
    }
    function beforeSubmit() {
        setShowInvalidMessages(true);
    }
    function afterSubmit() {
        history.push('/confirmation/contact');
    }

    return (
        <SalesforceForm postTo={postTo} afterSubmit={afterSubmit}>
            <input type="hidden" name="external" value="1" />
            <label>
                What is your question about?
                <DropdownSelect
                    name="subject" options={options}
                    onValueUpdate={onChangeSubject}
                />
            </label>
            <LabeledInputWithInvalidMessage showMessage={showInvalidMessages}>
                Your Name
                <input name="name" type="text" size="20" required />
            </LabeledInputWithInvalidMessage>
            <LabeledInputWithInvalidMessage showMessage={showInvalidMessages}>
                Your Email Address
                <input name="email" type="email" required />
            </LabeledInputWithInvalidMessage>
            <LabeledInputWithInvalidMessage className="auto-height" showMessage={showInvalidMessages}>
                Your Message
                <textarea cols="50" name="description" rows="6" required />
            </LabeledInputWithInvalidMessage>
            <input type="submit" value="Send" className="btn btn-orange" onClick={beforeSubmit} />
        </SalesforceForm>
    );
}
