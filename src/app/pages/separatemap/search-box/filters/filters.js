import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './filters.html';
import css from './filters.css';
import {on} from '~/helpers/controller/decorators';
import busMixin from '~/helpers/controller/bus-mixin';
import FormSelect from '~/components/form-select/form-select';

const spec = {
    template,
    css,
    view: {
        classes: ['filters']
    },
    regions: {
        institution: '.institution-region'
    },
    filters: {}
};

export default class extends componentType(spec, busMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }

        const options = [
            {label: 'Any', value: '', selected: true},
            {label: 'College/University', value: 'College/University'},
            {label: 'Technical/Community College', value: 'Technical/Community College'},
            {label: 'High School', value: 'High School'}
        ];

        this.select = new FormSelect({
            instructions: 'Type of institution',
            validationMessage: () => '',
            name: 'institution-type',
            options
        });
        this.regions.institution.attach(this.select);
        this.select.on('change', (newValue) => {
            if (newValue) {
                this.filters['institution-type'] = newValue;
            } else {
                delete this.filters['institution-type'];
            }
            this.emit('change', this.filters);
        });
    }

    @on('change [type="checkbox"]')
    handleChange(event) {
        const el = event.delegateTarget;

        if (el.checked) {
            this.filters[el.name] = true;
        } else {
            delete this.filters[el.name];
        }
        this.emit('change', this.filters);
    }

};
