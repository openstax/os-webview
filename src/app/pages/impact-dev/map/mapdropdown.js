import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './mapdropdown.html';
import {on} from '~/helpers/controller/decorators';

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
        const bbox = [[32.958984, -5.353521], [43.50585, 5.615985]];
        const showing = this.el.querySelectorAll('[data-toggle=hide]');

        console.log(target.dataset.long);
        console.log(target.dataset.lat);
        mObj.flyTo({
            center: [target.dataset.lat, target.dataset.long],
            zoom: 10
        });
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
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: block;');
            searchList.setAttribute('style', 'max-height: 67.4rem;');
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

        console.log(x);
        event.target.classList.add('testimonial_Mobclick');
        const y = this.el.querySelector(event.target.id);

        console.log(y);
    }

}
