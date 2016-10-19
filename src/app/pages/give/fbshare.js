import {Controller} from 'superb';
import settings from 'settings';
import {description as template} from './fbshare.html';

export default class FbShare extends Controller {

    init() {
        this.template = template;

        /* eslint-disable */
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        /* eslint-enable */

        this.model = {
            pageUrl: `${settings.apiOrigin}/give`
        };
    }

}
