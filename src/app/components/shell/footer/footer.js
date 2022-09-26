import React from 'react';
import CookieDialog from '../cookie-notice/cookie-notice';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons/faFacebookF';
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';
import {faLinkedinIn} from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import {faInstagram} from '@fortawesome/free-brands-svg-icons/faInstagram';
import './footer.scss';

function Footer({
    data: {
        supporters, copyright, apStatement,
        facebookLink, twitterLink, linkedinLink
    }
}) {
    return (
        <React.Fragment>
            <CookieDialog />
            <div className="top">
                <div className="boxed">
                    <RawHTML html={supporters} />
                    <div className="column col1">
                        <h3>Help</h3>
                        <a href="/contact">Contact Us</a>
                        <a href="https://openstax.secure.force.com/help">Support Center</a>
                        <a href="/faq">FAQ</a>
                    </div>
                    <div className="column col2">
                        <h3>OpenStax</h3>
                        <a href="/press">Press</a>
                        <a href="http://www2.openstax.org/l/218812/2016-10-04/lvk">Newsletter</a>
                        <a href="/careers">Careers</a>
                    </div>
                    <div className="column col3">
                        <h3>Policies</h3>
                        <a href="/accessibility-statement">Accessibility Statement</a>
                        <a href="/tos">Terms of Use</a>
                        <a href="/license">Licensing</a>
                        <a href="/privacy">Privacy Notice</a>
                        <a href="https://openstax.secure.force.com/help/articles/FAQ/OpenStax-Tutor-Student-Refund-Policy">
                            Tutor pricing and refund policy
                        </a>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="boxed">
                    <div className="copyrights">
                        <RawHTML html={copyright} />
                        <RawHTML Tag="ap-html" html={apStatement} />
                    </div>
                    <div className="social" role="directory">
                        <a className="btn btn-social facebook" href={facebookLink} title="Facebook">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a className="btn btn-social twitter" href={twitterLink} title="Twitter">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a className="btn btn-social linkedin" href={linkedinLink} title="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedinIn} title="LinkedIn" />
                        </a>
                        <a className="btn btn-social instagram" href="https://www.instagram.com/openstax/" title="Instagram">
                            <FontAwesomeIcon icon={faInstagram} title="Instagram" />
                        </a>
                        <a className="rice-logo" href="http://www.rice.edu">
                            <img
                                src="/dist/images/rice-white-text.webp" alt="Rice University logo"
                                width="99" height="40" />
                        </a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default function FooterLoader() {
    return (
        <footer className="page-footer">
            <LoaderPage slug="footer" Child={Footer} />
        </footer>
    );
}
