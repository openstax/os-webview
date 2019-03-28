import componentType from '~/helpers/controller/init-mixin';
import cmsMixin from '~/helpers/controller/cms-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import FormSelect from '~/components/form-select/form-select';
import $ from '~/helpers/$';
import {description as template} from './role-selector.html';
import css from './role-selector.css';

const spec = {
    template,
    css,
    view: {
        classes: ['role-selector']
    },
    slug: 'snippets/roles',
    model() {
        // props are an array of {contents, hideWhen}
        this.props = this.getProps();
        const result = this.props.map((p) => $.booleanAttribute(p.hideWhen(this.selectedRole)));

        result.hiddenAttribute = $.booleanAttribute(this.isHidden);
        return result;
    }
};

export default class RoleSelector extends componentType(spec, cmsMixin, busMixin) {

    init(getProps) {
        super.init();
        this.getProps = getProps;
        this.regions = {
            selector: '[data-region="selector"]',
            studentForm: '[data-region="student-form"]',
            facultyForm: '[data-region="faculty-form"]'
        };
        this.selectedRole = '';
        this.isHidden = false;
    }

    onLoaded() {
        const Region = this.regions.self.constructor;
        const regions = Array.from(this.el.querySelectorAll('[data-content]'))
            .map((r) => new Region(r, this));

        for (let i = 0; i < this.props.length; ++i) {
            regions[i].attach(this.props[i].contents);
        }
    }

    onDataLoaded() {
        const options = this.pageData.map((opt) => ({label: opt.display_name, value: opt.salesforce_name}));
        const selector = new FormSelect({
            instructions: 'I am a',
            validationMessage: () => '',
            placeholder: 'Please select one',
            options
        });

        selector.on('change', (newValue) => {
            this.selectedRole = newValue;
            this.update();
            $.scrollTo(this.el);
            this.emit('change', newValue);
        });
        this.regions.selector.attach(selector);
    }

}
