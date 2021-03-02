import React from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FooterDialog} from '~/components/dialog/dialog.jsx';
import accountsModel from '~/models/usermodel';
import analytics from '~/helpers/analytics';
import './cookie-notice.css';

const cookie = {
    get hash() {
        return decodeURIComponent(document.cookie)
            .split('; ')
            .reduce((a, b) => {
                const [key, val] = b.split('=');

                a[key] = val;
                return a;
            }, {});
    },
    setKey(key) {
        document.cookie = `${key}=true;path=/;expires=Tue, 19 Jan 2038 03:14:07 GMT`;
    }
};
const ACKNOWLEDGEMENT_KEY = 'cookie_notice_acknowledged';

function acknowledged() {
    // ONLY TO test locally:
    // return false;
    return cookie.hash[ACKNOWLEDGEMENT_KEY];
}

function CookieNoticeBody({onClose}) {
    return (
        <div className="cookie-notice">
            <div class="message">
                We use cookies to optimize your experience on our website. By continuing on the
                website, you are agreeing to our use of cookies. You can find more information,
                including how to opt out, in our <a href="/privacy-policy">Privacy Policy</a>.
            </div>
            <button type="button" class="primary" onClick={onClose}>Got it!</button>
        </div>
    );
}

function CookieNoticeDialog() {
    const [isOpen, toggle] = useToggle(true);

    function onClose(event) {
        cookie.setKey(ACKNOWLEDGEMENT_KEY);
        toggle();
    }

    return (
        <FooterDialog isOpen={isOpen} title="Privacy and cookies">
            <CookieNoticeBody onClose={onClose} />
        </FooterDialog>
    );
}

export default function ShowNoticeOrNot() {
    const [showCookieDialog, toggle] = useToggle();

    React.useEffect(() => {
        accountsModel.load().then((response) => {
            // Uncomment these three lines ONLY to test locally:
            // response.uuid = 'testing';
            // response.is_not_gdpr_location = true;
            // document.cookie = `${ACKNOWLEDGEMENT_KEY}=true; expires=Tue, 19 Jan 2000 03:14:07 GMT`;


            if (typeof response.id !== 'undefined') {
                const userid = response.uuid;

                if (!response.is_not_gdpr_location || response.opt_out_of_cookies) {
                    return;
                }
                analytics.setUser(userid);
                if (!acknowledged()) {
                    toggle();
                }
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        showCookieDialog ? <CookieNoticeDialog /> : null
    );
}
