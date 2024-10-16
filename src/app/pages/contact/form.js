import React, {useState, useRef, useEffect} from 'react';
import SalesforceForm from '~/components/salesforce-form/salesforce-form';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import {useNavigate, useLocation} from 'react-router-dom';
import { FileButton } from '../errata-form/form/FileUploader';
import useUserContext from '~/contexts/user';
import './form.scss';

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

function useIsEmbedded() {
    const {pathname} = useLocation();

    return pathname.includes('embedded');
}

function useAfterSubmit(setSubmitted) {
    const navigate = useNavigate();
    const isEmbedded = useIsEmbedded();

    return React.useCallback(
        () => {
            if (isEmbedded) {
                setSubmitted(true);
            } else {
                navigate('/confirmation/contact');
            }
        },
        [navigate, isEmbedded, setSubmitted]
    );
}

function useSubjectWithInitialization() {
    const isEmbedded = useIsEmbedded();
    const initialValue = isEmbedded ? 'OpenStax Assignable' : 'General';
    const subjectState = useState(initialValue);

    // useEffect runs too late
    React.useMemo(
        () => {
            for (const o of options) {
                if (o.value === initialValue) {
                    o.selected = true;
                } else {
                    delete o.selected;
                }
            }
        },
        [initialValue]
    );

    return subjectState;
}

// This is an interim site; normally we can leave postTo null and the default
// in the salesforceForm will be right.
const newPostSite = 'https://hooks.zapier.com/hooks/catch/175480/3n62dhe/';

export default function ContactForm({setSubmitted}) {
    const [showInvalidMessages, setShowInvalidMessages] = useState(false);
    const [subject, setSubject] = useSubjectWithInitialization();
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
    const beforeSubmit = React.useCallback(
        () => setShowInvalidMessages(true),
        [setShowInvalidMessages]
    );
    const afterSubmit = useAfterSubmit(setSubmitted);
    const searchParams = new window.URLSearchParams(window.location.search);
    const bodyParams = searchParams.getAll('body').join('\n');
    const {userStatus} = useUserContext();
    const userUuid = searchParams.get('user_id') ?? userStatus.uuid;

    return (
        <SalesforceForm postTo={postTo} afterSubmit={afterSubmit}>
            <input type="hidden" name="external" value="1" />
            <input type="hidden" name="product" value={product} />
            <input type="hidden" name="user_id" value={userUuid} />
            <input type="hidden" name="support_context" value={bodyParams} />
            <label>
                <div className="label-text">
                    What is your question about?
                </div>
                <DropdownSelect
                    name="subject"
                    options={options}
                    onValueUpdate={setSubject}
                />
            </label>
            {
                assignableSelected && <label>
                    <div className="label-text">
                        What Assignable topic in particular?
                    </div>
                    <DropdownSelect
                        name="feature" options={assignableOptions}
                    />
                </label>
            }
            <LabeledInputWithInvalidMessage showMessage={showInvalidMessages}>
                <div className="label-text">
                    Your Name
                </div>
                <input name="name" type="text" size="20" required />
            </LabeledInputWithInvalidMessage>
            <LabeledInputWithInvalidMessage showMessage={showInvalidMessages}>
                <div className="label-text">
                   Your Email Address
                </div>
                <input name="email" type="email" required />
            </LabeledInputWithInvalidMessage>
            <LabeledInputWithInvalidMessage className="auto-height" showMessage={showInvalidMessages}>
                <div className="label-text">
                    Your Message
                </div>
                <textarea cols="50" name="description" rows="6" required />
            </LabeledInputWithInvalidMessage>
            <div className="label-text">
                Please add a screenshot or any other file that helps explain your request.
            </div>
            <FileButton name="attachment" />
            <input type="submit" className="btn btn-orange" onClick={beforeSubmit} />
        </SalesforceForm>
    );
}
