import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';
import {description as template} from './technology-selector.html';

export default class TechnologySelector extends CMSPageController {

    init(model) {
        this.template = template;
        this.view = {
            classes: ['technology-selector']
        };
        this.css = `/app/components/technology-selector/technology-selector.css?${VERSION}`;
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
                name: '00NU0000005VmTu',
                value,
                label
            }), onChange);

            this.regions.checkboxes.append(cb);
        });
    }

}
