import React from 'react';
import {assertDefined} from '~/helpers/data';
import usePageContext from '../page-context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebook} from '@fortawesome/free-brands-svg-icons/faFacebook';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons/faLinkedin';
import {faSquareXTwitter} from '@fortawesome/free-brands-svg-icons/faSquareXTwitter';
import {faInstagram} from '@fortawesome/free-brands-svg-icons/faInstagram';
import {faYoutube} from '@fortawesome/free-brands-svg-icons/faYoutube';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import './inquiries.scss';

export default function Inquiries() {
    const pageData = assertDefined(usePageContext());
    const name = pageData.pressInquiryName;
    const phone = pageData.pressInquiryPhone;
    const email = pageData.pressInquiryEmail;
    const pressKitUrl = pageData.pressKitUrl;

    return (
        <div className="inquiries">
            <div>
                <h2>Press inquiries</h2>
                <div className="contact">
                    {Boolean(name) && <div>{name}</div>}
                    <div>
                        <a href={`tel:${phone}`}>{phone}</a>
                    </div>
                    <div>
                        <a href={`mailto:${email}`}>{email}</a>
                    </div>
                </div>
            </div>
            <div className="find-us">
                <h2>Find us on</h2>
                <div className="icon-row">
                    <a href="https://www.facebook.com/openstax">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://www.linkedin.com/company/openstax">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href="https://www.instagram.com/openstax/">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://twitter.com/openstax">
                        <FontAwesomeIcon icon={faSquareXTwitter} />
                    </a>
                    <a href="https://www.youtube.com/openstax">
                        <FontAwesomeIcon icon={faYoutube} />
                    </a>
                </div>
            </div>
            <a href={pressKitUrl} className="btn primary">
                Download press kit
                <FontAwesomeIcon icon={faDownload} />
            </a>
        </div>
    );
}
