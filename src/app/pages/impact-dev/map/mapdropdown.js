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
        console.log(event);
        const target = event.delegateTarget;
        const focusId = target.id;
        const unqIdArr = focusId.split('-');
        const unqId = unqIdArr[1];
        const toggleOnoff = target.dataset.toggle;
        const filterStyle = this.el.querySelector(`#icon-${unqId}`);
        const mObj = this.model.mapObj;
        const bbox = [[32.958984, -5.353521], [43.50585, 5.615985]];

        mObj.fitBounds(bbox);
        console.log(toggleOnoff);
        filterStyle.classList.toggle('fa-chevron-circle-down');
        filterStyle.classList.toggle('fa-chevron-circle-up');
        if (toggleOnoff === 'show') {
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: block;');
            target.dataset.toggle='hide';
        } else {
            document.getElementById(`data-${unqId}`).setAttribute('style', 'display: none;');
            target.dataset.toggle='show';
        }
        console.log(mObj);
    }

}
