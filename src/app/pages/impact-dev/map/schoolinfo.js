import VERSION from '~/version';
import {Controller} from 'superb.js';
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
        this.popObject= props.pObj;
    }

    @on('click .testimonial-head')
    tesnimonialClick(event) {
        if (this.model.iObj==='single_value') {
            document.getElementById('back-result-div').setAttribute('style', 'display: none;');
            document.getElementById('back-search-div').setAttribute('style', 'display: none;');
            document.getElementById('back-detail-single-div').setAttribute('style', 'display: block;');
        } else {
            document.getElementById('back-result-div').setAttribute('style', 'display: none;');
            document.getElementById('back-detail-div').setAttribute('style', 'display: block;');
        }
        document.getElementById('detail-info-mob').setAttribute('style', 'display: none;');
        document.getElementById('testimonial-body-mob').setAttribute('style', 'display: block;');
    }

    @on('click .nxt-previous-links')
    rightLink(event) {
        const target = event.delegateTarget;
        const currentIndex = this.model.itemIndex;
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
            const Region = dropdownObj.regions.self.constructor;
            const unqClassTestMob = '.testimonial-body-mob';
            const regionTestimonialMob = new Region(unqClassTestMob, dropdownObj);
            const validField = this.model.dataArray[validIndex].fields;

            this.popObject = pObject;
            schoolHeader.model = validField;
            schoolHeader.update();
            this.update();
            if (validField.testimonial !== null) {
                regionTestimonialMob.attach(new Testimonialinfo(this.model));
            }
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

        if (nextIndex in arr) {
            rslt = nextIndex;
        } else {
            rslt = 'undefined';
        }

        return rslt;
    }

}
