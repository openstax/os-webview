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
            classes: ['toggle_dataList_head']
        };
        this.model = props;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }
    @on('click .toggle_on_off')
    toggleOnoff(event) {
        const target = event.delegateTarget;
        const mObj = this.model.mapObj;
        const focusId = target.id;
        const unqIdArr = focusId.split('-');
        const unqId = unqIdArr[1];
        const Region = this.regions.self.constructor;
        const indexItem = this.model.lData.findIndex((t) => t.pk === Number(unqId));
        const modelObj = {
            dataArray: this.model.lData,
            itemIndex: indexItem
        };

        console.log(event);
        console.log(indexItem);
        if (window.innerWidth < 960) {
            const unqClassDetailMob = '.detailinfoMOb';
            const unqClassTestMob = '.testimonialBodyMob';
            const regionDetailInfoMob = new Region(unqClassDetailMob, this);
            const regionTestimonialMob = new Region(unqClassTestMob, this);

            this.showDetailMob();
            regionDetailInfoMob.attach(new Schoolinfo(modelObj));
            regionTestimonialMob.attach(new Testimonialinfo(modelObj));
        } else {
            const unqClassDetail = `.detailinfo-${unqId}`;
            const unqClassTest = `.testimonialBody-${unqId}`;
            const regionDetailInfo = new Region(unqClassDetail, this);
            const regionTestimonial = new Region(unqClassTest, this);

            regionDetailInfo.attach(new Schoolinfo(modelObj));
            regionTestimonial.attach(new Testimonialinfo(modelObj));
            this.showDetailScreen(event);
        }
        mObj.flyTo({
            center: [target.dataset.lat, target.dataset.long],
            zoom: 14
        });
        new mapboxgl.Popup({
            closeOnClick: false
        })
            .setLngLat([target.dataset.lat, target.dataset.long])
            .setHTML(`<h5>${target.dataset.name}</h5><br>${target.dataset.city}`)
            .addTo(mObj);
    }
    showDetailScreen(event) {
        const target = event.delegateTarget;
        const focusId = target.id;
        const unqIdArr = focusId.split('-');
        const unqId = unqIdArr[1];
        const toggleOnoff = target.dataset.toggle;
        const filterStyle = this.el.querySelector(`#icon-${unqId}`);
        const searchList = this.el.querySelector('.search_list');
        const mObj = this.model.mapObj;
        const showing = this.el.querySelectorAll('[data-toggle=hide]');

        filterStyle.classList.toggle('fa-angle-down');
        filterStyle.classList.toggle('fa-angle-up');
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
            searchList.setAttribute('style', 'max-height: 67.4rem;');
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: block;');
            target.dataset.toggle = 'hide';
        } else {
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: none;');
            searchList.setAttribute('style', 'max-height: 28.8rem;overflow-y: scroll');
            target.dataset.toggle = 'show';
        }
    }
    showDetailMob() {
        const searchList = document.getElementsByClassName('search-div-container');
        const detailinfoMOb = this.el.querySelector('.detailinfoMOb');
        const searchList1 = this.el.querySelector('.search_list');

        searchList1.setAttribute('style', 'display: none');
        document.getElementById('search').setAttribute('style', 'display: none');
        detailinfoMOb.setAttribute('style', 'display: block');
        document.getElementById('backToSearch_div').setAttribute('style', 'display: none;');
        document.getElementById('backToResult_div').setAttribute('style', 'display: block;');
    }

}
