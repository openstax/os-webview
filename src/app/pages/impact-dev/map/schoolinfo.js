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
            classes: ['toggle_dataList_head']
        };
        this.model= props;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }
    @on('click .testimonial_head')
    tesnimonialClick(event) {
        document.getElementById('backToResult_div').setAttribute('style', 'display: none;');
        document.getElementById('backToDetail_div').setAttribute('style', 'display: block;');
        document.getElementById('detailinfoMOb').setAttribute('style', 'display: none;');
        document.getElementById('testimonialBodyMob').setAttribute('style', 'display: block;');
    }

}
