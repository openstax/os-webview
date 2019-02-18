import salesforce from '~/models/salesforce';
import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './hidden-fields.html';

const spec = {
    template,
    view: {
        classes: ['hidden-fields']
    },
    model() {
        this.props = this.getProps();

        return {
            salesforce,
            book: this.props.book,
            adoptionStatus: this.props.adoptionStatus,
            numberOfStudents: this.props.numberOfStudents,
            isFirst: this.props.isFirst,
            role: this.props.role
        };
    }
};

export default class HiddenFields extends componentType(spec) {

    init(getProps) {
        super.init();
        this.getProps = getProps;
    }

}
