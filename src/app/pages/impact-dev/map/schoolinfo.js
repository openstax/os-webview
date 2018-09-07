import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './schoolinfo.html';
import {on} from '~/helpers/controller/decorators';
import Dropdown from './mapdropdown';
import Testimonialinfo from './testimonial';

export default class Schoolinfo extends Controller {

    init(props) {
        this.template = template;
        this.css = `/app/pages/impact-dev/map/map.css?${VERSION}`;
        this.view = {
            classes: ['toggle-datalist-head']
        };
        this.model= props;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }
    @on('click .testimonial-head')
    tesnimonialClick(event) {
        document.getElementById('back-result-div').setAttribute('style', 'display: none;');
        document.getElementById('back-detail-div').setAttribute('style', 'display: block;');
        document.getElementById('detail-info-mob').setAttribute('style', 'display: none;');
        document.getElementById('testimonial-body-mob').setAttribute('style', 'display: block;');
    }

}
