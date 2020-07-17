import PageContext from '../page-context';
import React, {useContext} from 'react';
import './inquiries.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function FABrandIcon({icon}) {
    return (
        <FontAwesomeIcon icon={['fab', icon]} />
    );
}

export default function Inquiries() {
    const pageData = useContext(PageContext);

    if (!pageData) {
        return null;
    }

    const name = pageData.press_inquiry_name;
    const phone = pageData.press_inquiry_phone;
    const email = pageData.press_inquiry_email;
    const pressKitUrl = pageData.press_kit_url;

    return (
        <div className="inquiries">
            <div>
                <h2>Press inquiries</h2>
                <div className="contact">
                    {
                        Boolean(name) && <div>{name}</div>
                    }
                    <div>{phone}</div>
                    <div>{email}</div>
                </div>
            </div>
            <div className="find-us">
                <h2>Find us on</h2>
                <div className="icon-row">
                    <a href="https://www.facebook.com/openstax">
                        <FABrandIcon icon="facebook" />
                    </a>
                    <a href="https://www.linkedin.com/company/openstax">
                        <FABrandIcon icon="linkedin" />
                    </a>
                    <a href="https://www.instagram.com/openstax/">
                        <FABrandIcon icon="instagram" />
                    </a>
                    <a href="https://twitter.com/openstax">
                        <FABrandIcon icon="twitter-square" />
                    </a>
                </div>
            </div>
            <a href={pressKitUrl} className="btn primary">
                Download press kit
                <FontAwesomeIcon icon="download" />
            </a>
        </div>
    );
}
