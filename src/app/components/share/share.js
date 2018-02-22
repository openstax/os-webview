import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './share.html';

/* eslint-disable */
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id) || !fjs) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
/* eslint-enable */

export default class Share extends Controller {

    init(pageUrl, message) {
        this.template = template;
        this.css = `/app/components/share/share.css?${VERSION}`;
        this.view = {
            classes: ['share-buttons']
        };
        this.model = {
            message: encodeURIComponent(message),
            pageUrl: encodeURIComponent(pageUrl)
        };
    }

}
