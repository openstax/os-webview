import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import FormSelect from '~/components/form-select/form-select';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './role-selector.html';

export default class RoleSelector extends CMSPageController {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['role-selector']
        };
        this.css = `/app/components/role-selector/role-selector.css?${VERSION}`;
        this.regions = {
            selector: '[data-region="selector"]',
            studentForm: '[data-region="student-form"]',
            facultyForm: '[data-region="faculty-form"]'
        };
        this.slug = 'snippets/roles';
        this.selectedRole = '';
        this.model = () => this.getModel();
    }

    getModel() {
        // props are an array of {contents, hideWhen}
        this.props = this.getProps();

        return this.props.map((p) => $.booleanAttribute(p.hideWhen(this.selectedRole)));
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

        this.regions.selector.attach(new FormSelect({
            instructions: 'I am a',
            validationMessage: () => '',
            placeholder: 'Please select one',
            options
        }, (newValue) => {
            this.selectedRole = newValue;
            this.update();
        }));
    }

}
