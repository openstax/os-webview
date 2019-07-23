import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './cookie-notice.html';
import css from './cookie-notice.css';
import {on} from '~/helpers/controller/decorators';
import accountsModel from '~/models/usermodel';
import shellBus from '../shell-bus';

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

function acknowledge() {
    cookie.setKey(ACKNOWLEDGEMENT_KEY);
}

class CookieNotice extends componentType(spec, busMixin) {

    @on('click button.primary')
    dismissPermanently() {
        acknowledge();
        this.emit('close');
    }

}

export default function showNoticeIfNeeded() {
    accountsModel.load().then((response) => {
        if (typeof response.id !== 'undefined' && !acknowledged()) {
            const cookieNotice = new CookieNotice();

            shellBus.emit('showDialog', () => ({
                title: 'Privacy and cookies',
                content: cookieNotice,
                customClass: 'footer-style',
                nonModal: true
            }));
            cookieNotice.on('close', () => {
                shellBus.emit('hideDialog');
            });
        }
    });
}
