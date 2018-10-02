import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './schoolinfo-head.html';


export default class SchoolinfoHead extends Controller {

    init(props) {
        this.template = template;
        this.css = `/app/pages/impact-dev/map/map.css?${VERSION}`;
        this.view = {
            classes: ['list-data', 'detail-info-head']
        };
        this.model= props.dataArray[props.itemIndex].fields;
    }

}
