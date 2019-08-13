import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './cookie-notice.html';
import css from './cookie-notice.css';
import {on} from '~/helpers/controller/decorators';
import accountsModel from '~/models/usermodel';
import shellBus from '../shell-bus';
import analytics from '~/helpers/analytics';

const spec = {
    template,
    css,
    view: {
        classes: ['cookie-notice']
    }
};

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
        document.cookie = `${key}=true; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
    }
};
const ACKNOWLEDGEMENT_KEY = 'cookie_notice_acknowledged';

function acknowledged() {
    return cookie.hash[ACKNOWLEDGEMENT_KEY];
}

class CookieNotice extends componentType(spec, busMixin) {

    @on('click button.primary')
    acknowledge() {
        cookie.setKey(ACKNOWLEDGEMENT_KEY);
        analytics.setUser(this.userid);
        this.emit('close');
    }

}

export default function showNoticeIfNeeded() {
    accountsModel.load().then((response) => {
        // Uncomment these three lines ONLY to test locally:
        // response.id = 'testing';
        // response.is_gdpr_location = false;
        // document.cookie = `${ACKNOWLEDGEMENT_KEY}=true; expires=Tue, 19 Jan 2000 03:14:07 GMT`;

        if (typeof response.id !== 'undefined') {
            const userid = response.id.toString();

            if (acknowledged()) {
                analytics.setUser(userid);
            } else if (response.is_gdpr_location === false) {
                const cookieNotice = new CookieNotice({
                    userid
                });

                shellBus.emit('showDialog', () => ({
                    title: 'Privacy and cookies',
                    content: cookieNotice,
                    customClass: 'footer-style',
                    nonModal: true,
                    noPutAway: true,
                    noAutoFocus: true
                }));
                cookieNotice.on('close', () => {
                    shellBus.emit('hideNonModal');
                    cookieNotice.detach();
                });
            }
        }
    });
}
