import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import BaseCollection from '~/helpers/backbone/collection';
import $ from '~/helpers/$';
import Option from '../select-option/select-option';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './single-select.hbs';

@props({
    template: template,
    regions: {
        optionList: '.option-list'
    }
})
export default class SingleSelect extends BaseView {
    @on('click .selected-button')
    activate(e) {
        this.togglePulldown();
        e.stopPropagation();
    }

    constructor() {
        super();
        this.stateCollection = new BaseCollection();
    }

    togglePulldown() {
        let isOpen;

        if (this.optionListEl) {
            this.optionListEl.classList.toggle('hidden', ...arguments);
        }
        if (this.hasDropdownEl) {
            if (arguments.length) {
                isOpen = !arguments[0];
            }
            this.hasDropdownEl.classList.toggle('open', isOpen);
        }
    }

    synchronizeModel(what) {
        if (what.get('selected') === true) {
            if (this.selectedButtonEl) {
                this.selectedButtonEl.textContent = what.get('label');
            }
            let originalOption = what.get('originalOption');

            originalOption.selected = true;
            this.stateCollection.each((model) => {
                let option = model.get('originalOption');

                if (option !== originalOption) {
                    option.selected = false;
                }
            });
            this.checkValid(originalOption);
        }
    }

    set(newValue) {
        this.stateCollection.each((model) => {
            model.set('selected', model.get('value') === newValue);
        });
    }

    checkValid(originalOption) {
        let originalSelect = originalOption.parentNode;

        if (originalSelect.required) {
            let valid = false;

            for (let opt of Array.from(originalSelect.options)) {
                if (opt.selected && opt.value) {
                    valid = true;
                }
            }
            this.el.classList.toggle('invalid', !valid);
        }
    }

    doValidChecks() {
        this.stateCollection.each((model) => {
            this.checkValid(model.get('originalOption'));
        });
    }

    replace(originalSelect) {
        for (let opt of Array.from(originalSelect.options)) {
            let optionModel = new BaseModel({
                selected: opt.selected,
                label: opt.textContent,
                value: opt.value,
                originalOption: opt
            });

            this.stateCollection.add(optionModel);
        }
        this.stateCollection.on('change:selected', (what) => {
            this.togglePulldown();
            this.synchronizeModel(what);
        });

        let wrapper = document.createElement('div');

        originalSelect.parentNode.insertBefore(wrapper, originalSelect);
        this.parentRegion = new this.regions.self.constructor(wrapper);
        this.parentRegion.show(this);
        originalSelect.classList.add('hidden');
    }

    onRender() {
        $.applyScrollFix(this);
        this.selectedButtonEl = this.el.querySelector('.selected-button');
        this.optionListEl = this.el.querySelector('.option-list');
        this.hasDropdownEl = this.el.querySelector('.has-dropdown');
        this.el.classList.add('proxy-widget', 'single-select');
        this.stateCollection.each((model) => {
            let ssOption = new Option(model);

            this.regions.optionList.append(ssOption);
            model.set('listItem', ssOption);
            this.synchronizeModel(model);
        });
    }
}
