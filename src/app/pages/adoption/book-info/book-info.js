import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './book-info.hbs';

const noneBoxSelector = '.require-one input[type="checkbox"][value="None"]',
    otherBoxSelector = 'input[type="checkbox"][value="other"]';

@props({
    template: template
})
export default class BookInfoView extends BaseView {

    @on('change .require-one input[type="checkbox"]')
    checkboxChanged(e) {
        this.checkboxesChecked += e.target.checked ? 1 : -1;
        let addOrRemove = this.checkboxesChecked > 0 ? 'remove' : 'add';

        this.checkboxGroup.classList[addOrRemove]('invalid');
    }

    @on(`change ${noneBoxSelector}`)
    noneBoxChanged() {
        let boxes = this.checkboxGroup.querySelectorAll('input[type=checkbox]:not([value="None"])'),
            noneBox = this.noneBox;

        for (let i=0; i<boxes.length; ++i) {
            let box=boxes[i];

            if (noneBox.checked && box.checked) {
                box.checked = false;
                box.dispatchEvent(new Event('change'));
            }
            if (box) {
                box.disabled = noneBox.checked;
            }
        }
    }

    @on(`change ${otherBoxSelector}`)
    otherBoxChange() {
        let otherText = this.el.querySelector(this.otherTextSelector),
            otherBox = this.el.querySelector(otherBoxSelector);

        if (!otherBox.checked) {
            otherText.value = '';
        }
        if (otherText) {
            otherText.disabled = !otherBox.checked;
        }
    }

    constructor(prefix) {
        super();
        this.templateHelpers = {
            prefix: prefix
        };
        this.checkboxesChecked = 0;
        this.prefix = prefix;
        this.otherTextSelector = `input[type="text"][name="${prefix}[other]"]`;
    }
    onRender() {
        this.checkboxGroup = this.el.querySelector('.require-one');
        this.checkboxGroup.classList.add('invalid');
        this.noneBox = this.el.querySelector(noneBoxSelector);
        let otherBox = this.el.querySelector(otherBoxSelector),
            otherText = this.el.querySelector(this.otherTextSelector);

        if (otherText) {
            otherText.disabled = !otherBox.checked;
        }
    }
}
