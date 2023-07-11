import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useToggle} from '~/helpers/data';
import useUserContext from '~/contexts/user';
import cookie from '~/helpers/cookie';
import './cookie-notice.scss';

const ACKNOWLEDGEMENT_KEY = 'cookie_notice_acknowledged';
const FORCE_COOKIE_NOTICE = false; // Set to true ONLY TO TEST

function acknowledged() {
    return !FORCE_COOKIE_NOTICE && cookie.hash[ACKNOWLEDGEMENT_KEY];
}

export default function ShowNoticeOrNot() {
    const [showCookieDialog, toggle] = useToggle();
    const {userModel} = useUserContext();
    const onClose = React.useCallback(
        () => {
            cookie.setKey(ACKNOWLEDGEMENT_KEY);
            toggle();
        },
        [toggle]
    );

    React.useEffect(
        () => { // eslint-disable-line complexity
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
                if (!accountsModel.is_not_gdpr_location || accountsModel.opt_out_of_cookies) {
                    return;
                }
                if (!acknowledged()) {
                    toggle();
                }
            }
        },
        [userModel, toggle]
    );

    return (
        showCookieDialog ? <JITLoad importFn={() => import('./cookie-notice-dialog.js')} onClose={onClose} /> : null
    );
}
