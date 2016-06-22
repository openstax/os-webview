import BannerView from '~/pages/home/banners/banner-view';
import {description as template} from './chemistry.html';

export default class Chemistry extends BannerView {

    init() {
        this.template = template;
        this.css = '/app/pages/home/banners/chemistry/chemistry.css';
        this.view = {
            classes: ['chemistry']
        };
    }

}
