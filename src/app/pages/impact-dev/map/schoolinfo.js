import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './schoolinfo.html';
import {on} from '~/helpers/controller/decorators';
import Dropdown from './mapdropdown';

export default class Schoolinfo extends Controller {

    init(props) {
        this.template = template;
        this.css = `/app/pages/impact-dev/map/map.css?${VERSION}`;
        this.view = {
            classes: ['toggle-datalist-head']
        };
        this.model= props;
        this.popObject= props.pObj;
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

    @on('click .nxt-previous-links')
    rightLink(event) {
        const target = event.delegateTarget;
        const currentIndex = target.dataset.index;
        const action = target.dataset.action;
        const dArray = this.model.dataArray;
        const schoolHeader = this.model.shObj;
        const offSet = [0, -230];
        const validIndex = this.chkValidindex(action, dArray, currentIndex);

        if (validIndex !== 'undefined') {
            const dropdownObj = new Dropdown('empty_model');
            const objS = {
                pObject: this.popObject,
                mapObject: this.model.mapObj
            };

            this.model.itemIndex = validIndex;
            const pObject = dropdownObj.flyToPopUp(objS, offSet, dArray, validIndex);

            this.popObject = pObject;
            schoolHeader.model = this.model;
            schoolHeader.update();
            this.update();
        }
    }
    chkValidindex(act, arr, currentIndex) {
        let nextIndex;
        let rslt;

        if (act === 'next') {
            nextIndex = Number(currentIndex)+1;
        } else {
            nextIndex = Number(currentIndex)-1;
        }

        const aaa = arr[nextIndex];

        if (nextIndex in arr) {
            rslt = nextIndex;
        } else {
            rslt = 'undefined';
        }

        return rslt;
    }

}
