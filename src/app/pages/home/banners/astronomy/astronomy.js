import BannerView from '~/pages/home/banners/banner-view';
import {description as template} from './astronomy.html';

export default class Astronomy extends BannerView {

    init() {
        this.template = template;
        this.css = '/app/pages/home/banners/astronomy/astronomy.css';
        this.view = {
            classes: ['astronomy']
        };
    }

}
