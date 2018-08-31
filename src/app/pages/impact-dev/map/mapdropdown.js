import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './mapdropdown.html';
import {on} from '~/helpers/controller/decorators';
import mapboxgl from 'mapbox-gl';

export default class Mapdropdown extends Controller {

    init(props) {
        this.template = template;
        this.css = `/app/pages/imapct-dev/impact-dev.css?${VERSION}`;
        this.view = {
            classes: ['droplist']
        };
        this.model= props;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        if (window.innerWidth < 960) {
            const elements= this.el.querySelectorAll('.testimonial_head');

            elements.forEach((v) => {
                v.setAttribute('style', 'display: block;');
                console.log(v);
            });
        }
    }
    @on('click .toggle_on_off')
    toggleOnoff(event) {
        const target = event.delegateTarget;
        const focusId = target.id;
        const unqIdArr = focusId.split('-');
        const unqId = unqIdArr[1];
        const toggleOnoff = target.dataset.toggle;
        const filterStyle = this.el.querySelector(`#icon-${unqId}`);
        const searchList= this.el.querySelector('.search_list');
        const mObj = this.model.mapObj;
        const showing = this.el.querySelectorAll('[data-toggle=hide]');

        console.log(event);
        console.log(target.dataset);
        mObj.flyTo({
            center: [target.dataset.lat, target.dataset.long],
            zoom: 14
        });
        new mapboxgl.Popup({closeOnClick: false})
            .setLngLat([target.dataset.lat, target.dataset.long])
            .setHTML(`${target.dataset.name}<br>${target.dataset.city}`)
            .addTo(mObj);
        filterStyle.classList.toggle('fa-angle-down');
        filterStyle.classList.toggle('fa-angle-up');
        if (toggleOnoff === 'show') {
            if (showing.length) {
                const alreadyShow = showing[0].id.split('-');
                const alreadyShowId = alreadyShow[1];
                const alreadyShowStyle = this.el.querySelector(`#icon-${alreadyShowId}`);

                alreadyShowStyle.classList.toggle('fa-angle-up');
                alreadyShowStyle.classList.toggle('fa-angle-down');
                showing[0].dataset.toggle='show';
                document.getElementById(`data-${alreadyShowId}`).setAttribute('style', 'display: none;');
            }
            this.showDetailMob();
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: block;');
            target.dataset.toggle='hide';
        } else {
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: none;');
            searchList.setAttribute('style', 'max-height: 28.8rem;overflow-y: scroll');
            target.dataset.toggle='show';
        }
        console.log(mObj);
    }
    @on('click .testimonial_head')
    tesnimonialClick(event) {
        console.log(event);
        const x = this.el.querySelector(event.target.id);

        this.el.querySelector('.list_data').setAttribute('style', 'display: none;');
        this.el.querySelector('.toggle_dataList_head').setAttribute('style', 'display: none;');
        document.getElementById('search_container').setAttribute('style', 'bottom: 41rem;');
        this.el.querySelector('.search_list').setAttribute('style', 'max-height: 41.4rem;');
    }
    showDetailMob() {
        const searchList= this.el.querySelector('.search_list');

        if (window.innerWidth < 960) {
            searchList.setAttribute('style', 'max-height: 27.4rem;overflow-y: hidden;');
            document.getElementById('backToSearch_div').setAttribute('style', 'display: none;');
            document.getElementById('search').setAttribute('style', 'display: none;');
            document.getElementById('backToResult_div').setAttribute('style', 'display: block;');
            this.el.querySelector('.list_show_more').setAttribute('style', 'display: none;');
        } else {
            searchList.setAttribute('style', 'max-height: 67.4rem;');
        }
    }

}
