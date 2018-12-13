import {Controller} from 'superb.js';
import {description as template} from './schoolinfo-head.html';
import css from './map.css';

export default class SchoolinfoHead extends Controller {

    init(props) {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['list-data', 'detail-info-head']
        };
        this.model= props.dataArray[props.itemIndex].fields;
    }

}
