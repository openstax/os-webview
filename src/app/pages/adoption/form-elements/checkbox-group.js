import BaseView from '~/helpers/backbone/view';
import CheckboxView from './checkbox';
import {props} from '~/helpers/backbone/decorators';
import {template} from './checkbox-group.hbs';

@props({
    template: template
})

export default class CheckboxGroupView extends BaseView {
    constructor(options) {
        super();
        let simpleBoxTemplate = function (label) {
            return {
                id: options.idFromLabel(label),
                label: label,
                name: options.boxGroupName,
                value: label
            };
        };

        this.templates = options.labels.map(simpleBoxTemplate);

        if (options.other) {
            let otherCbTemplate = simpleBoxTemplate('Other');

            otherCbTemplate.textInput = {
                id: `${options.prefix}_other`,
                name: `${options.prefix}[other]`
            };
            this.templates.push(otherCbTemplate);
        }

        this.templateHelpers = {
            label: options.topLabel,
            required: options.required
        };
        this.boxEls = {};
    }
    disableBoxes(whether) {
        for (let id in this.boxEls) {
            if (this.boxEls.hasOwnProperty(id)) {
                let el = this.boxEls[id];

                if (whether) {
                    el.checked = false;
                    el.dispatchEvent(new Event('change'));
                }
                el.disabled = whether;
            }
        }
    }
    onRender() {
        this.regions.self.el = this.el;
        let boxEls = this.boxEls,
            views = this.templates.map((helper) => new CheckboxView(helper));

        views.forEach((view) => {
            let id   = view.templateHelpers.id,
                label = view.templateHelpers.label;

            view.on('render', () => {
                let boxEl = document.getElementById(id);

                if (label === 'None') {
                    boxEl.addEventListener('change', (event) => {
                        this.disableBoxes(event.target.checked);
                    });
                } else {
                    boxEls[id] = boxEl;
                }
            });
            this.regions.self.append(view);
        });
    }
}
