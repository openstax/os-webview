import BannerView from '~/pages/home/banners/banner-view';
import {description as template} from './us-history.html';

export default class USHistory extends BannerView {

    init() {
        this.template = template;
        this.css = '/app/pages/home/banners/us-history/us-history.css';
        this.view = {
            classes: ['us-history']
        };
    }

}
