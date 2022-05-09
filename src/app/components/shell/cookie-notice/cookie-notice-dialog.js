import React from 'react';
import {FooterDialog} from '~/components/dialog/dialog';

export default function CookieNoticeDialog({onClose}) {
    return (
        <FooterDialog isOpen className="cookie-footer">
            <div className="cookie-notice">
                <div className="message">
                    We use cookies to optimize your experience on our website. By continuing on the
                    website, you are agreeing to our use of cookies. You can find more information,
                    including how to opt out, in our <a href="/privacy">Privacy Notice</a>.
                </div>
                <button type="button" className="primary" onClick={onClose}>Got it!</button>
            </div>
        </FooterDialog>
    );
}
