import CMSPageController from '~/controllers/cms';
import FormSelect from '~/components/form-select/form-select';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './role-selector.html';
import css from './role-selector.css';

export default class RoleSelector extends CMSPageController {

    init(getProps, onChange) {
        this.template = template;
        this.getProps = getProps;
        this.onChange = onChange;
        this.view = {
            classes: ['role-selector']
        };
        this.css = css;
        this.regions = {
            selector: '[data-region="selector"]',
            studentForm: '[data-region="student-form"]',
            facultyForm: '[data-region="faculty-form"]'
        };
        this.slug = 'snippets/roles';
        this.selectedRole = '';
        this.isHidden = false;
        this.model = () => this.getModel();
    }

    getModel() {
        // props are an array of {contents, hideWhen}
        this.props = this.getProps();
        const result = this.props.map((p) => $.booleanAttribute(p.hideWhen(this.selectedRole)));

        result.hiddenAttribute = $.booleanAttribute(this.isHidden);
        return result;
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
            if (this.onChange) {
                this.onChange(newValue);
            }
        });
        this.regions.selector.attach(selector);
    }

}
