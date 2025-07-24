import React from 'react';
import Copyright from '~/layouts/default/footer/copyright';
import CookieYesToggle from '~/layouts/default/footer/cookie-yes-toggle';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import ListOfLinks from '~/components/list-of-links/list-of-links';
import {useDialog} from '~/components/dialog/dialog';
import usePortalContext from '~/contexts/portal';
import './flex.scss';

type Props = {
    data: {
        copyright: string | undefined;
        apStatement: string | undefined;
    }
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
            const formUrl = '/embedded/contact';

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
    // ** Temporarily disabling
    // const {ContactDialog, open: openContactDialog} = useContactDialog();
    // const contactFormParams = [{key: 'source_url', value: window.location.href}];
    const {rewriteLinks} = usePortalContext();

    React.useLayoutEffect(() => rewriteLinks?.(document.querySelector('.page-footer') as HTMLElement),
    [rewriteLinks]);

    return (
        <div className="flex-page">
            <div className="boxed">
                <div className="copyrights">
                    <Copyright {...data} />
                </div>
                <div className="column col1">
                    <ListOfLinks>
                        <a href="/contact">Contact Us</a>
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
        <div className="page-footer" data-analytics-nav="Footer">
            <LoaderPage slug="footer" Child={FlexFooter} />
        </div>
    );
}
