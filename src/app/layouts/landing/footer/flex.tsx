import React from 'react';
import Copyright from '~/layouts/default/footer/copyright';
import CookieYesToggle from '~/layouts/default/footer/cookie-yes-toggle';
import LoaderPage from '~/components/jsx-helpers/loader-page';
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

function FlexFooter({data}: Props) {
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
        <footer className="page-footer" data-analytics-nav="Footer">
            <LoaderPage slug="footer" Child={FlexFooter} />
        </footer>
    );
}
