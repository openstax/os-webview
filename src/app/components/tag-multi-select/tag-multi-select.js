import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import BaseCollection from '~/helpers/backbone/collection';
import Tag from './tag/tag';
import Option from '../select-option/select-option';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './tag-multi-select.hbs';

@props({
    template,
    regions: {
        tagList: '.tag-list',
        optionList: '.option-list'
    }
})
export default class TagMultiSelect extends BaseView {
    @on('click .activate-pulldown')
    displayPulldown(e) {
        e.preventDefault();
        e.stopPropagation();
        this.togglePulldown();
    }

    @on('click .tag-list')
    displayPulldownIfNotTag(e) {
        if (e.target.classList.contains('tag-list')) {
            this.displayPulldown(e);
        }
        e.preventDefault();
    }

    togglePulldown() {
        let optionList = this.el.querySelector('.option-list');

        optionList.classList.toggle('hidden', ...arguments);
        this.hasDropdownEl.classList.toggle('open', ...arguments);
    }

    constructor() {
        super();
        this.stateCollection = new BaseCollection();
    }

    checkValid(originalOpt) {
        let parentWidget = originalOpt.parentNode;

        if (parentWidget.required) {
            let someSelected = this.stateCollection.some((item) => item.get('selected') === true);

            this.el.classList.toggle('invalid', !someSelected);
        }
    }

    doValidChecks() {
        this.stateCollection.each((model) => {
            this.checkValid(model.get('originalOption'));
        });
    }

    synchronizeModel(what) {
        let tagItem = what.get('tagItem'),
            listItem = what.get('listItem'),
            originalOpt = what.get('originalOption'),
            label = what.get('label');

        if (what.get('selected') === true) {
            this.regions.tagList.append(tagItem);
            listItem.el.classList.add('hidden');
            originalOpt.selected = true;
            if (label === 'None') {
                this.stateCollection.each((model) => {
                    if (model !== what) {
                        model.set('selected', false);
                    }
                });
            } else {
                this.stateCollection.each((model) => {
                    if (model.get('label') === 'None') {
                        model.set('selected', false);
                    }
                });
            }
        } else if (what.get('selected') === false) {
            tagItem.remove();
            listItem.el.classList.remove('hidden');
            originalOpt.selected = false;
            let stillSelected = this.stateCollection.some((item) => item.get('selected') === true),
                noneItem = this.stateCollection.findWhere({label: 'None'});

            if (noneItem && !stillSelected) {
                noneItem.set('selected', true);
            }
        }
        this.checkValid(originalOpt);
    }

    replace(originalMs) {
        for (let opt of Array.from(originalMs.options)) {
            let optionModel = new BaseModel({
                selected: opt.selected,
                label: opt.textContent,
                value: opt.value,
                originalOption: opt
            });

            this.stateCollection.add(optionModel);
        }

        this.stateCollection.on('change:selected', (what) => {
            this.synchronizeModel(what);
        });

        let wrapper = document.createElement('div');

        originalMs.parentNode.insertBefore(wrapper, originalMs);
        this.parentRegion = new this.regions.self.constructor(wrapper);
        this.parentRegion.show(this);
        originalMs.classList.add('hidden');
    }

    onRender() {
        this.el.classList.add('proxy-widget', 'tag-multi-select');
        this.hasDropdownEl = this.el.querySelector('.has-dropdown');
        this.stateCollection.each((model) => {
            let msOption = new Option(model),
                tag = new Tag(model);

            this.regions.optionList.append(msOption);
            model.set({
                listItem: msOption,
                tagItem: tag
            });
            this.synchronizeModel(model);

            let controlledElementId = model.get('originalOption').dataset.other;

            if (controlledElementId) {
                let controlledElement = document.getElementById(controlledElementId),
                    controlledInput = controlledElement.querySelector('input');

                model.on('change:selected', () => {
                    let newValue = model.get('selected');

                    controlledElement.classList.toggle('hidden', !newValue);
                    controlledInput.required = newValue;
                    if (!newValue) {
                        controlledInput.value = '';
                    }
                });

                model.trigger('change:selected', model);
            }
        });
    }
}
