import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './testimonial.html';
import {on} from '~/helpers/controller/decorators';
import mapboxgl from 'mapbox-gl';

export default class Schoolinfo extends Controller {

    init(props) {
        this.template = template;
        this.css = `/app/pages/impact-dev/map/map.css?${VERSION}`;
        this.view = {
            classes: ['toggle-datalist-body']
        };
        this.model = props;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

}
