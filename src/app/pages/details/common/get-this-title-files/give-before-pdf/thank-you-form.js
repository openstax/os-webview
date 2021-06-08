import React from 'react';
import {useUserModel} from '~/models/usermodel';
import './thank-you-form.scss';

function FormWithAfterSubmit({
    afterSubmit,
    responseId='form-response',
    children,
    onSubmit: firstOnSubmit,
    ...formProps
}) {
    const iframeRef = React.useRef();

    function onSubmit(event) {
        if (firstOnSubmit) {
            firstOnSubmit(event);
            if (event.defaultPrevented) {
                return;
            }
        }
        const iframe = iframeRef.current;
        const runAfterSubmit = () => {
            afterSubmit();
            iframe.removeEventListener('load', runAfterSubmit);
        };

        iframe.addEventListener('load', runAfterSubmit);
    }

    return (
        <React.Fragment>
            <iframe
                name={responseId} id={responseId} className="hidden"
                src="" width="0" height="0" tabIndex="-1"
                ref={iframeRef}
            />
            <form target={responseId} {...formProps} onSubmit={onSubmit}>
                {children}
            </form>
        </React.Fragment>
    );
}

function ThankYou({userModel={}, link, close}) {
    const first = userModel.first_name;
    const last = userModel.last_name;
    const school = userModel.self_reported_school;

    function afterSubmit() {
        window.open(link);
        close();
    }

    return (
        <FormWithAfterSubmit
            action={`${window.SETTINGS.apiOrigin}/apps/cms/api/donations/thankyounote/`}
            method="post"
            className="thank-you-form"
            afterSubmit={afterSubmit}
        >
            <h1>Send us a thank you note</h1>
            <div className="instructions">
                <span className="asterisk" />
                indicates required field
            </div>
            <label>
                Your message <span className="asterisk" />
                <textarea
                    name="thank_you_note" rows="4"
                    placeholder="Start typing"
                    required
                />
            </label>
            <div className="names">
                <label>
                    First name <span className="asterisk" />
                    <input
                        name="first_name" type="text"
                        placeholder="Your first name"
                        required
                        defaultValue={first}
                    />
                </label>
                <label>
                    Last name <span className="asterisk" />
                    <input
                        name="last_name" type="text"
                        placeholder="Your last name"
                        required
                        defaultValue={last}
                    />
                </label>
            </div>
            <label>
                Institution name <span className="asterisk" />
                <input
                    name="institution" type="text"
                    placeholder="Your school"
                    required
                    defaultValue={school}
                />
            </label>
            <button className="primary">Submit note and go to PDF</button>
        </FormWithAfterSubmit>
    );
}

export default function ThankYouForm({link, close}) {
    const userModel = useUserModel();

    return (
        <ThankYou userModel={userModel} link={link} close={close} />
    );
}
