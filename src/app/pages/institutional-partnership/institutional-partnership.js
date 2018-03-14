import VERSION from '~/version';
import {on} from '~/helpers/controller/decorators';
import {Controller} from 'superb.js';
import {description as template} from './institutional-partnership.html';

export default class Institutional extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/institutional-partnership/institutional-partnership.css?${VERSION}`;
        this.view = {
            tag: 'main',
            classes: ['institutional-page', 'page']
        };
    }

    onLoaded() {
        this.programTestimonial = this.el.querySelector('.testimonial-program');
        this.applicationTestimonial = this.el.querySelector('.testimonial-application');
        this.programTestimonial.classList.add('is-show');
    }

    @on('click #btn-tab1')
    showProgramTestimonial() {
        this.programTestimonial.classList.add('is-show');
        this.applicationTestimonial.classList.remove('is-show');
    }

    @on('click #btn-tab2')
    showApplicationTestimonial() {
        this.programTestimonial.classList.remove('is-show');
        this.applicationTestimonial.classList.add('is-show');
    }

}
