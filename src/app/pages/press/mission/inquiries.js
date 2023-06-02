import usePageContext from '../page-context';
import React from 'react';
import './inquiries.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebook} from '@fortawesome/free-brands-svg-icons/faFacebook';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons/faLinkedin';
import {faTwitterSquare} from '@fortawesome/free-brands-svg-icons/faTwitterSquare';
import {faInstagram} from '@fortawesome/free-brands-svg-icons/faInstagram';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';

export default function Inquiries() {
    const pageData = usePageContext();
    const name = pageData.pressInquiryName;
    const phone = pageData.pressInquiryPhone;
    const email = pageData.pressInquiryEmail;
    const pressKitUrl = pageData.pressKitUrl;

    return (
        <div className='inquiries'>
            <div>
                <h2>Press inquiries</h2>
                <div className='contact'>
                    {Boolean(name) && <div>{name}</div>}
                    <div>
                        <a href={`tel:${phone}`}>{phone}</a>
                    </div>
                    <div>
                        <a href={`mailto:${email}`}>{email}</a>
                    </div>
                </div>
            </div>
            <div className='find-us'>
                <h2>Find us on</h2>
                <div className='icon-row'>
                    <a href='https://www.facebook.com/openstax'>
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href='https://www.linkedin.com/company/openstax'>
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href='https://www.instagram.com/openstax/'>
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href='https://twitter.com/openstax'>
                        <FontAwesomeIcon icon={faTwitterSquare} />
                    </a>
                </div>
            </div>
            <a href={pressKitUrl} className='btn primary'>
                Download press kit
                <FontAwesomeIcon icon={faDownload} />
            </a>
        </div>
    );
}
