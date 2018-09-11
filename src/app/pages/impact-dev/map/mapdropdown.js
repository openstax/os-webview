import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './mapdropdown.html';
import {on} from '~/helpers/controller/decorators';
import Schoolinfo from './schoolinfo';
import Testimonialinfo from './testimonial';
import mapboxgl from 'mapbox-gl';

export default class Mapdropdown extends Controller {

    init(props) {
        this.template = template;
        this.css = `/app/pages/imapct-dev/impact-dev.css?${VERSION}`;
        this.view = {
            classes: ['toggle-datalist-head']
        };
        this.model = props;
        this.offSet = [];
        this.popUp = 'empty';
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }
    @on('click .toggle-on-off')
    toggleOnoff(event) {
        const target = event.delegateTarget;
        const mObj = this.model.mapObj;
        const lData = this.model.lData;
        const focusId = target.id;
        const unqIdArr = focusId.split('-');
        const unqId = unqIdArr[1];
        const Region = this.regions.self.constructor;
        const indexItem = this.model.lData.findIndex((t) => t.pk === Number(unqId));
        const modelObj = {
            dataArray: lData,
            itemIndex: indexItem,
            mapObj: mObj
        };
        const objS = {
            pObject: this.popUp,
            mapObject: mObj
        };

        if (window.innerWidth < 960) {
            const unqClassDetailMob = '.detail-info-mob';
            const unqClassTestMob = '.testimonial-body-mob';
            const regionDetailInfoMob = new Region(unqClassDetailMob, this);
            const regionTestimonialMob = new Region(unqClassTestMob, this);

            this.offSet = [0, -230];

            this.showDetailMob();
            this.flyToPopUp(objS, this.offSet, lData, indexItem);
            regionDetailInfoMob.attach(new Schoolinfo(Object.assign(modelObj, {pObj: this.popUp})));
            if (lData[indexItem].fields.testimonial !== null) {
                regionTestimonialMob.attach(new Testimonialinfo(modelObj));
            }
        } else {
            const unqClassDetail = `.detailinfo-${unqId}`;
            const unqClassTest = `.testimonialBody-${unqId}`;
            const regionDetailInfo = new Region(unqClassDetail, this);
            const regionTestimonial = new Region(unqClassTest, this);

            this.offSet = [300, 0];
            this.flyToPopUp(objS, this.offSet, lData, indexItem);
            regionDetailInfo.attach(new Schoolinfo(modelObj));
            if (lData[indexItem].fields.testimonial !== null) {
                regionTestimonial.attach(new Testimonialinfo(modelObj));
            }
            this.showDetailScreen(event);
        }
    }
    showDetailScreen(event) {
        const target = event.delegateTarget;
        const focusId = target.id;
        const unqIdArr = focusId.split('-');
        const unqId = unqIdArr[1];
        const toggleOnoff = target.dataset.toggle;
        const filterStyle = this.el.querySelector(`#icon-${unqId}`);
        const searchList = this.el.querySelector('.search-list');
        const mObj = this.model.mapObj;
        const showing = this.el.querySelectorAll('[data-toggle=hide]');

        filterStyle.classList.toggle('fa-chevron-down');
        filterStyle.classList.toggle('fa-chevron-up');
        if (toggleOnoff === 'show') {
            if (showing.length) {
                const alreadyShow = showing[0].id.split('-');
                const alreadyShowId = alreadyShow[1];
                const alreadyShowStyle = this.el.querySelector(`#icon-${alreadyShowId}`);

                alreadyShowStyle.classList.toggle('fa-angle-up');
                alreadyShowStyle.classList.toggle('fa-angle-down');
                showing[0].dataset.toggle = 'show';
                document.getElementById(`data-${alreadyShowId}`).setAttribute('style', 'display: none;');
            }
            // searchList.setAttribute('style', 'max-height: 41rem;');
            searchList.classList.add('active');
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: block;');
            target.dataset.toggle = 'hide';
        } else {
            searchList.classList.remove('active');
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: none;');
            searchList.setAttribute('style', 'overflow-y: scroll');
            target.dataset.toggle = 'show';
        }
    }
    showDetailMob() {
        const detailinfoMOb = this.el.querySelector('.detail-info-mob');
        const searchList = this.el.querySelector('.search-list');

        searchList.setAttribute('style', 'display: none');
        document.getElementById('search').setAttribute('style', 'display: none');
        detailinfoMOb.setAttribute('style', 'display: block');
        document.getElementById('back-search-div').setAttribute('style', 'display: none;');
        document.getElementById('back-result-div').setAttribute('style', 'display: block;');
    }
    flyToPopUp(objectS, offSet, lData, indexItem) {
        const lat = lData[indexItem].fields.lat;
        const long = lData[indexItem].fields.long;
        const iName = lData[indexItem].fields.name;
        const pCity = lData[indexItem].fields.physical_city;
        const pState = lData[indexItem].fields.physical_state_province;

        if (objectS.pObject !== 'empty') {
            objectS.pObject.remove();
        }
        objectS.mapObject.flyTo({
            center: [lat, long],
            offset: offSet,
            zoom: 14
        });

        const tooltip = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        tooltip.setLngLat([lat, long]);
        tooltip.setHTML(`<b>${iName}</b><br>${pCity}, ${pState}`);
        tooltip.addTo(objectS.mapObject);
        this.popUp = tooltip;
        return tooltip;
    }
    onClose() {
        if (this.popUp !== 'empty') {
            this.popUp.remove();
        }
    }

}
