import salesforce from '~/models/salesforce';
import {Controller} from 'superb.js';
import {description as template} from './hidden-fields.html';

export default class HiddenFields extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['hidden-fields']
        };
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return {
            salesforce,
            book: this.props.book,
            adoptionStatus: this.props.adoptionStatus,
            numberOfStudents: this.props.numberOfStudents
        };
    }

}
