import {Controller} from 'superb';
// import Model from '~/models/model';
// import Collection from '~/models/collection';
// import $ from '~/helpers/$';
// import Tag from './tag/tag';
// import Option from '../select-option/select-option';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './tag-multi-select.html';

export default class TagMultiSelect extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['proxy-widget', 'tag-multi-select']
        };
        this.regions = {
            tagList: '.tag-list',
            optionList: '.option-list'
        };
        // this.stateCollection = new Collection();
    }

    /*
    @on('click .activate-pulldown')
    displayPulldown(e) {
        e.preventDefault();
        e.stopPropagation();
        this.togglePulldown();
    }

    @on('click .tag-list')
    displayPulldownIfNotTag(e) {
        e.preventDefault();

        if (e.target.classList.contains('tag-list')) {
            this.displayPulldown(e);
        }
    }
    */

    /*
    togglePulldown(...args) {
        // FIX: Move DOM Manipulation to template
        const optionList = this.el.querySelector('.option-list');
        let isOpen;

        optionList.classList.toggle('hidden', ...args);
        if (args.length > 0) {
            isOpen = !args[0];
        }
        this.hasDropdownEl.classList.toggle('open', isOpen);
    }

    checkValid(originalOpt) {
        const parentWidget = originalOpt.parentNode;

        if (parentWidget.required) {
            const someSelected = this.stateCollection.some((item) => item.get('selected') === true);

            this.el.classList.toggle('invalid', !someSelected);
        }
    }

    doValidChecks() {
        this.stateCollection.each((model) => {
            this.checkValid(model.get('originalOption'));
        });
    }

    synchronizeModel(what) {
        const tagItem = what.get('tagItem');
        const listItem = what.get('listItem');
        const originalOpt = what.get('originalOption');
        const label = what.get('label');

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
            const stillSelected = this.stateCollection.some((item) => item.get('selected') === true);
            const noneItem = this.stateCollection.findWhere({label: 'None'});

            if (noneItem && !stillSelected) {
                noneItem.set('selected', true);
            }
        }
        this.checkValid(originalOpt);
    }

    replace(originalMs) {
        for (const opt of Array.from(originalMs.options)) {
            const optionModel = new Model({
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

        const wrapper = document.createElement('div');

        originalMs.parentNode.insertBefore(wrapper, originalMs);
        this.parentRegion = new this.regions.self.constructor(wrapper);
        this.parentRegion.attach(this);
        originalMs.classList.add('hidden');
    }

    onLoaded() {
        $.applyScrollFix(this);
        this.hasDropdownEl = this.el.querySelector('.has-dropdown');
        this.stateCollection.each((model) => {
            const msOption = new Option(model);
            const tag = new Tag(model);

            this.regions.optionList.append(msOption);
            model.set({
                listItem: msOption,
                tagItem: tag
            });
            this.synchronizeModel(model);

            const controlledElementId = model.get('originalOption').dataset.other;

            if (controlledElementId) {
                const controlledElement = document.getElementById(controlledElementId);
                const controlledInput = controlledElement.querySelector('input');

                model.on('change:selected', () => {
                    const newValue = model.get('selected');

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
    */

}
