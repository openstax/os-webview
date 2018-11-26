import {Controller} from 'superb.js';
import {description as template} from './survey-request.html';
import css from './survey-request.css';

const expireDate = new Date('2018-09-11T05:00:00Z');
const dayMS = 24 * 60 * 60 * 1000;

export default class SurveyRequest extends Controller {

    init() {
        const now = Date.now();

        if (now > expireDate) {
            console.log('Survey is expired and will not display.');
            this.template = () => '';
        } else {
            console.log(`Survey will expire in ${Math.floor((expireDate - now) / dayMS)} days`);
            this.template = template;
        }
        this.view = {
            classes: ['survey-request']
        };
        this.css = css;
    }

}
