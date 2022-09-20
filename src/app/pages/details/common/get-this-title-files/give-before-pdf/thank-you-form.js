import React from 'react';
import useUserContext from '~/contexts/user';
import './thank-you-form.scss';

function FormWithAfterSubmit({
    afterSubmit,
    responseId='form-response',
    children,
    onSubmit: firstOnSubmit,
    ...formProps
}) {
    const iframeRef = React.useRef();
    const onSubmit = React.useCallback(
        (event) => {
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
        },
        [firstOnSubmit, afterSubmit]
    );

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

export default function ThankYou({link, close}) {
    const {userModel} = useUserContext();
    const first = userModel?.first_name;
    const last = userModel?.last_name;
    const school = userModel?.self_reported_school;
    const afterSubmit = React.useCallback(
        () => {
            window.open(link);
            close();
        },
        [link, close]
    );

    return (
        <FormWithAfterSubmit
            action={`${process.env.API_ORIGIN}/apps/cms/api/donations/thankyounote/`}
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
                <label>
                    Institution name <span className="asterisk" />
                    <input
                        name="institution" type="text"
                        placeholder="Your school"
                        required
                        defaultValue={school}
                    />
                </label>
                <label>
                    Email address
                    <input
                        name="contact_email_address" type="email"
                        placeholder="Your email (optional)"
                    />
                </label>
            </div>
            <div className="consent-checkbox">
                <label>
                    Consent <span className="asterisk" />
                </label>
                <label className="cb-group">
                    <input
                        type="checkbox" name="consent_to_share_or_contact" value="True"
                    />
                    By clicking here I understand that OpenStax may include my story
                    in publications and distribution in printed, electronic, and digital
                    media.
                </label>
            </div>
            <button className="primary">Submit note and go to PDF</button>
            <a className="never-mind" href={link}>Never mind, just go to the PDF</a>
        </FormWithAfterSubmit>
    );
}
