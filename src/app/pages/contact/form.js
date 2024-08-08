import React, {useState, useRef, useEffect} from 'react';
import SalesforceForm from '~/components/salesforce-form/salesforce-form';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import {useNavigate} from 'react-router-dom';
import { FileButton } from '../errata-form/form/FileUploader';

const options = [
    'General',
    'Adopting OpenStax Textbooks',
    'OpenStax Kinetic',
    'OpenStax Assignable',
    'Staxly, AI Study Coach',
    'Donations',
    'College/University Partnerships',
    'Media Inquiries',
    'Foundational Support',
    'OpenStax Partners',
    'Website',
    'OpenStax Polska'
].map((s) => ({label: s, value: s}));

options[0].selected = true;

const assignableOptions = [
    'Getting Started',
    'Assignment',
    'Grade book',
    'Error Message',
    'Feature Request',
    'Accessibility',
    'Accounts & password',
    'Privacy'
].map((s) => ({label: s, value: s}));

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

// This is an interim site; normally we can leave postTo null and the default
// in the salesforceForm will be right.
const newPostSite = 'https://hooks.zapier.com/hooks/catch/175480/3n62dhe/';

export default function ContactForm() {
    const [showInvalidMessages, setShowInvalidMessages] = useState(false);
    const [subject, setSubject] = useState('General');
    const assignableSelected = React.useMemo(
        () => subject === 'OpenStax Assignable',
        [subject]
    );
    const product = React.useMemo(
        () => assignableSelected ? 'Assignable' : '',
        [assignableSelected]
    );
    const postTo = React.useMemo(
        () => (subject === 'OpenStax Polska') ? '/apps/cms/api/mail/send_mail' : newPostSite,
        [subject]
    );
    const navigate = useNavigate();
    const onChangeSubject = React.useCallback(
        (value) => setSubject(value),
        []
    );
    const textAreaRef = React.useRef(null);
    const beforeSubmit = React.useCallback(
        () => setShowInvalidMessages(true),
        [setShowInvalidMessages]
    );
    const afterSubmit = React.useCallback(
        () => navigate('/confirmation/contact'),
        [navigate]
    );
    const searchParams = new window.URLSearchParams(window.location.search);
    const bodyParams = searchParams.getAll('body').join('\n');

    return (
        <SalesforceForm postTo={postTo} afterSubmit={afterSubmit}>
            <input type="hidden" name="external" value="1" />
            <input type="hidden" name="product" value={product} />
            <input type="hidden" name="user_id" value={searchParams.get('user_id')} />
            <input type="hidden" name="support_context" value={bodyParams} />
            <label>
                What is your question about?
                <DropdownSelect
                    name="subject" options={options}
                    onValueUpdate={onChangeSubject}
                />
            </label>
            {
                assignableSelected && <label>What Assignable topic in particular?
                <DropdownSelect
                    name="feature" options={assignableOptions}
                />
                </label>
            }
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
                <textarea cols="50" name="description" rows="6" required ref={textAreaRef} />
            </LabeledInputWithInvalidMessage>
            <FileButton name="attachment" />
            <input type="submit" value="Send" className="btn btn-orange" onClick={beforeSubmit} />
        </SalesforceForm>
    );
}
