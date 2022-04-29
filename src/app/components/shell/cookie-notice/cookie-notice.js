import React from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FooterDialog} from '~/components/dialog/dialog';
import useUserContext from '~/contexts/user';
import analytics from '~/helpers/analytics';
import cookie from '~/helpers/cookie';
import './cookie-notice.scss';

const ACKNOWLEDGEMENT_KEY = 'cookie_notice_acknowledged';
const FORCE_COOKIE_NOTICE = false; // Set to true ONLY TO TEST

function acknowledged() {
    return !FORCE_COOKIE_NOTICE && cookie.hash[ACKNOWLEDGEMENT_KEY];
}

function CookieNoticeBody({onClose}) {
    return (
        <div className="cookie-notice">
            <div className="message">
                We use cookies to optimize your experience on our website. By continuing on the
                website, you are agreeing to our use of cookies. You can find more information,
                including how to opt out, in our <a href="/privacy">Privacy Notice</a>.
            </div>
            <button type="button" className="primary" onClick={onClose}>Got it!</button>
        </div>
    );
}

function CookieNoticeDialog() {
    const [isOpen, toggle] = useToggle(true);

    function onClose() {
        cookie.setKey(ACKNOWLEDGEMENT_KEY);
        toggle();
    }

    return (
        <FooterDialog isOpen={isOpen} className="cookie-footer">
            <CookieNoticeBody onClose={onClose} />
        </FooterDialog>
    );
}

export default function ShowNoticeOrNot() {
    const [showCookieDialog, toggle] = useToggle();
    const {userModel} = useUserContext();

    React.useEffect(() => { // eslint-disable-line complexity
        if (!userModel) {
            return;
        }
        const {accountsModel} = userModel;

        if (FORCE_COOKIE_NOTICE) {
            accountsModel.uuid = 'testing';
            accountsModel.is_not_gdpr_location = true; // eslint-disable-line camelcase
            document.cookie = `${ACKNOWLEDGEMENT_KEY}=true; expires=Tue, 19 Jan 2000 03:14:07 GMT`;
        }

        if (typeof accountsModel.id !== 'undefined') {
            const userid = accountsModel.uuid;

            if (!accountsModel.is_not_gdpr_location || accountsModel.opt_out_of_cookies) {
                return;
            }
            analytics.setUser(userid);
            if (!acknowledged()) {
                toggle();
            }
        }
    }, [userModel]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        showCookieDialog ? <CookieNoticeDialog /> : null
    );
}
