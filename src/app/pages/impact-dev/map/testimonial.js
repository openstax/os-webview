import {Controller} from 'superb.js';
import {description as template} from './testimonial.html';
import {on} from '~/helpers/controller/decorators';
import TestimonialForm from './testimonial-form';

export default class Testmonialinfo extends Controller {

    init(props) {
        this.template = template;
        this.view = {
            classes: ['toggle-datalist-body']
        };
        this.model = props;
    }

    @on('click .sub-testimonial')
    showTestimonialForm(event) {
        const form = new TestimonialForm({
            school: this.model.dataArray[this.model.itemIndex]
        });

        form.show();
        event.preventDefault();
    }

}
