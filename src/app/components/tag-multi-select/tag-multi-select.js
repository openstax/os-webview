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

    togglePulldown() {
        this.el.querySelector('.option-list').classList.toggle('hidden', ...arguments);
    }

    constructor() {
        super();
        this.stateCollection = new BaseCollection();
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
    }

    replace(originalMs) {
        for (let opt of originalMs.options) {
            let optionModel = new BaseModel({
                selected: opt.selected,
                label: opt.textContent,
                value: opt.value,
                originalOption: opt
            });

            this.stateCollection.add(optionModel);
        }

        this.stateCollection.on('change:selected', (what) => {
            this.togglePulldown(true);
            this.synchronizeModel(what);
        });

        let wrapper = document.createElement('div');

        originalMs.parentNode.insertBefore(wrapper, originalMs);
        this.parentRegion = new this.regions.self.constructor(wrapper);
        this.parentRegion.show(this);
        originalMs.classList.add('hidden');
    }

    onRender() {
        this.el.classList.add('tag-multi-select');
        this.stateCollection.each((model) => {
            let msOption = new Option(model),
                tag = new Tag(model);

            this.regions.optionList.append(msOption);
            model.set({
                listItem: msOption,
                tagItem: tag
            });
            this.synchronizeModel(model);
        });
    }
}
