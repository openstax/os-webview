import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import Copyright from './copyright';
import CookieYesToggle from './cookie-yes-toggle';
import ListOfLinks from '~/components/list-of-links/list-of-links';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons/faFacebookF';
import {faXTwitter} from '@fortawesome/free-brands-svg-icons/faXTwitter';
import {faLinkedinIn} from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import {faInstagram} from '@fortawesome/free-brands-svg-icons/faInstagram';
import {faYoutube} from '@fortawesome/free-brands-svg-icons/faYoutube';
import usePortalContext from '~/contexts/portal';
import './footer.scss';

function Footer({
    data: {
        supporters,
        copyright,
        apStatement,
        facebookLink,
        twitterLink,
        linkedinLink
    }
}: {
    data: {
        supporters: string;
        copyright: string;
        apStatement: string;
        facebookLink: string;
        twitterLink: string;
        linkedinLink: string;
    };
}) {
    const {rewriteLinks} = usePortalContext();

    React.useLayoutEffect(
        () =>
            rewriteLinks?.(
                document.querySelector('.page-footer') as HTMLElement
            ),
        [rewriteLinks]
    );

    return (
        <React.Fragment>
            <div className="top">
                <div className="boxed">
                    <RawHTML html={supporters} />
                    <div className="column col1">
                        <h3>Help</h3>
                        <ListOfLinks>
                            <a href="/contact">Contact Us</a>
                            <a href="https://help.openstax.org/s/">
                                Support Center
                            </a>
                            <a href="/faq">FAQ</a>
                            <a href="/print/">Order Print</a>
                            <a href="https://status.openstax.org/">
                                System Status
                            </a>
                        </ListOfLinks>
                    </div>
                    <div className="column col2">
                        <h3>OpenStax</h3>
                        <ListOfLinks>
                            <a href="/press">Press</a>
                            <a href="http://www2.openstax.org/l/218812/2016-10-04/lvk">
                                Newsletter
                            </a>
                            <a href="/careers">Careers</a>
                        </ListOfLinks>
                    </div>
                    <div className="column col3">
                        <h3>Policies</h3>
                        <ListOfLinks>
                            <a href="/accessibility-statement">
                                Accessibility Statement
                            </a>
                            <a href="/tos">Terms of Use</a>
                            <a href="/license">Licensing</a>
                            <a href="/privacy">Privacy Notice</a>
                            <CookieYesToggle />
                        </ListOfLinks>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="boxed">
                    <div className="copyrights">
                        <Copyright
                            copyright={copyright}
                            apStatement={apStatement}
                        />
                    </div>
                    <ul className="social">
                        <li>
                            <a
                                className="btn btn-social facebook"
                                href={facebookLink}
                                title="OpenStax on Facebook"
                            >
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </li>
                        <li>
                            <a
                                className="btn btn-social twitter"
                                href={twitterLink}
                                title="OpenStax on X"
                            >
                                <FontAwesomeIcon icon={faXTwitter} />
                            </a>
                        </li>
                        <li>
                            <a
                                className="btn btn-social linkedin"
                                href={linkedinLink}
                                title="OpenStax on LinkedIn"
                            >
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </li>
                        <li>
                            <a
                                className="btn btn-social instagram"
                                href="https://www.instagram.com/openstax/"
                                title="OpenStax on Instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                        </li>
                        <li>
                            <a
                                className="btn btn-social youtube"
                                href="https://www.youtube.com/openstax/"
                                title="OpenStax on YouTube"
                            >
                                <FontAwesomeIcon icon={faYoutube} />
                            </a>
                        </li>
                        <li>
                            <a className="rice-logo" href="http://www.rice.edu">
                                <img
                                    src="/dist/images/rice-white-text.webp"
                                    alt="Rice University logo"
                                    width="99"
                                    height="40"
                                />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
}

export default function FooterLoader() {
    return (
        <div className="page-footer" data-analytics-nav="Footer">
            <LoaderPage slug="footer" Child={Footer} />
        </div>
    );
}
