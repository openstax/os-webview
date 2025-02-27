import React from 'react';
import useUserContext from '~/contexts/user';
import trackLink from '../../track-link';
import './thank-you-form.scss';
import SchoolSelector from '~/components/school-selector/school-selector';
import {TrackedMouseEvent} from '~/components/shell/router-helpers/use-link-handler';

function FormWithAfterSubmit({
    afterSubmit,
    responseId = 'form-response',
    children,
    ...formProps
}: React.PropsWithChildren<
    {
        afterSubmit: () => void;
        responseId?: string;
    } & React.FormHTMLAttributes<HTMLFormElement>
>) {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const onSubmit = React.useCallback(
        () => {
            const iframe = iframeRef.current;
            const runAfterSubmit = () => {
                afterSubmit();
                iframe?.removeEventListener('load', runAfterSubmit);
            };

            iframe?.addEventListener('load', runAfterSubmit);
        },
        [afterSubmit]
    );

    return (
        <React.Fragment>
            <iframe
                title={responseId}
                id={responseId}
                className="hidden"
                src=""
                width="0"
                height="0"
                tabIndex={-1}
                ref={iframeRef}
            />
            <form target={responseId} {...formProps} onSubmit={onSubmit} name="thank-you form">
                {children}
            </form>
        </React.Fragment>
    );
}

export default function ThankYou({
    link,
    close,
    source,
    itemType = 'PDF',
    track,
    id
}: {
    link: string;
    close: () => void;
    source: string;
    itemType?: string;
    track?: string;
    id?: string;
}) {
    const {userModel} = useUserContext();
    const first = userModel?.first_name;
    const last = userModel?.last_name;
    const school = userModel?.self_reported_school;
    const afterSubmit = React.useCallback(() => {
        window.open(link);
        close();
    }, [link, close]);
    const trackDownload = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            trackLink(event as object as TrackedMouseEvent, id);
        },
        [id]
    );

    return (
        <FormWithAfterSubmit
            action={`${process.env.API_ORIGIN}/apps/cms/api/donations/thankyounote/`}
            method="post"
            className="thank-you-form"
            afterSubmit={afterSubmit}
        >
            <input type="hidden" name="source" value={source} />
            <h1>Send us a thank you note</h1>
            <div className="instructions">
                <span className="asterisk" />
                indicates required field
            </div>
            <label>
                Your message <span className="asterisk" />
                <textarea
                    name="thank_you_note"
                    rows={4}
                    placeholder="Start typing"
                    required
                />
            </label>
            <div className="names">
                <label>
                    First name <span className="asterisk" />
                    <input
                        name="first_name"
                        type="text"
                        placeholder="Your first name"
                        required
                        defaultValue={first}
                    />
                </label>
                <label>
                    Last name <span className="asterisk" />
                    <input
                        name="last_name"
                        type="text"
                        placeholder="Your last name"
                        required
                        defaultValue={last}
                    />
                </label>
                <SchoolSelector initialValue={school} />
                <label>
                    Email address
                    <input
                        name="contact_email_address"
                        type="email"
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
                        type="checkbox"
                        name="consent_to_share_or_contact"
                        value="True"
                    />
                    By clicking here I understand that OpenStax may include my
                    story in publications and distribution in printed,
                    electronic, and digital media.
                </label>
            </div>
            <button className="primary">
                Submit note and go to {itemType}
            </button>
            <a
                className="never-mind"
                href={link}
                {...(track ? {'data-track': track} : {})}
                data-variant={itemType}
                onClick={trackDownload}
            >
                Never mind, just go to the {itemType}
            </a>
        </FormWithAfterSubmit>
    );
}

export function useOnThankYouClick() {
    const [showThankYou, setShowThankYou] = React.useState(false);
    const onThankYouClick = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setShowThankYou(true);
    }, []);

    return {showThankYou, onThankYouClick};
}
