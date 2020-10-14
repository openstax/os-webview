import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import $ from '~/helpers/$';
import './footer.css';

function Footer({data}) {
    const {supporters, copyright, apStatement, facebookLink, twitterLink, linkedinLink} =
        $.camelCaseKeys(data);

    return (
        <React.Fragment>
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
                        <a href="/privacy-policy">Privacy Policy</a>
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
                            <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                        </a>
                        <a className="btn btn-social twitter" href={twitterLink} title="Twitter">
                            <FontAwesomeIcon icon={['fab', 'twitter']} />
                        </a>
                        <a className="btn btn-social linkedin" href={linkedinLink} title="LinkedIn">
                            <FontAwesomeIcon icon={['fab', 'linkedin-in']} title="LinkedIn" />
                        </a>
                        <a className="btn btn-social instagram" href="https://www.instagram.com/openstax/" title="Instagram">
                            <FontAwesomeIcon icon={['fab', 'instagram']} title="Instagram" />
                        </a>
                        <a className="rice-logo" href="http://www.rice.edu">
                            <img src="/images/rice-white-text.png" alt="Rice University logo" />
                        </a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function FooterLoader() {
    return (
        <LoaderPage slug="footer" Child={Footer} />
    );
}

const view = {
    tag: 'footer',
    classes: ['page-footer']
};

export default new (pageWrapper(FooterLoader, view))();
