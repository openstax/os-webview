import React from 'react';
import Copyright from '~/layouts/default/footer/copyright';
import CookieYesToggle from '~/layouts/default/footer/cookie-yes-toggle';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {useDialog} from '~/components/dialog/dialog';
import './flex.scss';

type Props = {
    data: {
        copyright: string | undefined;
        apStatement: string | undefined;
    }
}

function ListOfLinks({children}: React.PropsWithChildren<object>) {
    return (
        <ul className="list-of-links">
            {React.Children.toArray(children).map((c, i) => (<li key={i}>{c}</li>))}
        </ul>
    );
}

export function useContactDialog() {
    const [Dialog, open, close] = useDialog();

    function ContactDialog(
        {contactFormParams, className}: {
            contactFormParams?: {key: string; value: string}[];
            className?: string;
        }
    ) {
        const contactFormUrl = React.useMemo(() => {
            const formUrl = 'https://openstax.org/embedded/contact';

            if (contactFormParams !== undefined) {
                const params = contactFormParams
                    .map(({key, value}) => encodeURIComponent(`${key}=${value}`))
                    .map((p) => `body=${p}`)
                    .join('&');

                return `${formUrl}?${params}`;
            }

            return formUrl;
        }, [contactFormParams]);

        React.useEffect(
            () => {
                const closeOnSubmit = ({data}: MessageEvent) => {
                    if (data === 'CONTACT_FORM_SUBMITTED') {
                        close();
                    }
                };

                window.addEventListener('message', closeOnSubmit, false);
                return () => {
                    window.removeEventListener('message', closeOnSubmit, false);
                };
            },
            []
        );

        return (
            <Dialog className={className}>
                <iframe id="contact-us" src={contactFormUrl} />
            </Dialog>
        );
    };

    return {ContactDialog, open};
}

function FlexFooter({data}: Props) {
    const {ContactDialog, open: openContactDialog} = useContactDialog();
    const contactFormParams = [{key: 'source_url', value: window.location.href}];

    return (
        <div className="flex-page">
            <div className="boxed">
                <div className="copyrights">
                    <Copyright {...data} />
                </div>
                <div className="column col1">
                    <ListOfLinks>
                        <button onClick={openContactDialog}>
                            Contact Us
                            <ContactDialog
                                className="contact-dialog"
                                contactFormParams={contactFormParams}
                            />
                        </button>
                        <a href="/tos">Terms of Use</a>
                        <a href="/privacy">Privacy Notice</a>
                    </ListOfLinks>
                </div>
                <div className="column col2">
                    <ListOfLinks>
                        <a href="/accessibility-statement">Accessibility Statement</a>
                        <a href="/privacy">Privacy Notice</a>
                        <CookieYesToggle />
                    </ListOfLinks>
                </div>
            </div>
        </div>
    );
}

export default function FooterLoader() {
    return (
        <footer className="page-footer" data-analytics-nav="Footer">
            <LoaderPage slug="footer" Child={FlexFooter} />
        </footer>
    );
}
