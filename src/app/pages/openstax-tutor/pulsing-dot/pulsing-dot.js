import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './pulsing-dot.html';

export default class PulsingDot extends Controller {

    init() {
        this.template = template;
        this.model = {
            stopPulsing: false
        };
        this.view = {
            classes: ['pulsing-dot']
        };
        this.css = '/app/pages/openstax-tutor/pulsing-dot/pulsing-dot.css';
    }

    @on('click')
    stopPulsing() {
        this.model.stopPulsing = true;
        this.update();
    }

}
