import CMSPageController from '~/controllers/cms';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import FormInput from '~/components/form-input/form-input';
import {description as template} from './technology-selector.html';
import css from './technology-selector.css';

export default class TechnologySelector extends CMSPageController {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['technology-selector']
        };
        this.css = css;
        this.regions = {
            checkboxes: '[data-region="checkboxes"]'
        };
        this.model = model;
        this.slug = 'pages/partners';
    }

    onDataLoaded() {
        const options = Object.keys(this.pageData.allies)
            .map((key) => this.pageData.allies[key].title)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({
                label: title,
                value: title
            }));

        options.push({
            label: 'Other (specify below)',
            value: 'other-partner',
            onChange: (selected) => {
                this.model.showOtherBlank = selected;
                this.update();
            }
        });
        options.forEach(({label, value, onChange}) => {
            const cb = new BookCheckbox(() => ({
                name: 'Partner_Interest__c',
                value,
                label
            }));

            if (onChange) {
                cb.on('change', onChange);
            }
            this.regions.checkboxes.append(cb);
        });
    }

    onUpdate() {
        if (this.model.showOtherBlank) {
            const otherInput = new FormInput({
                name: 'Partner_Interest_Other__c',
                type: 'text',
                label: 'Other (include all other technologies you use)',
                required: true,
                validationMessage(name) {
                    return this.validated ? this.el.querySelector(`[name="${name}"]`).validationMessage : '';
                }
            });
            const Region = this.regions.self.constructor;
            const region = new Region(this.el.querySelector('.other-option'));

            region.attach(otherInput);
        }
    }

}
