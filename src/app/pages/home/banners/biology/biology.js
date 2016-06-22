import BannerView from '~/pages/home/banners/banner-view';
import {description as template} from './biology.html';

export default class Biology extends BannerView {

    init() {
        this.template = template;
        this.css = '/app/pages/home/banners/biology/biology.css';
        this.view = {
            classes: ['biology']
        };
    }

}
