import VERSION from '~/version';
import {Controller} from 'superb.js';
import {description as template} from './survey-request.html';

export default class SurveyRequest extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['survey-request']
        };
        this.css = `/app/components/survey-request/survey-request.css?${VERSION}`;
    }

}
