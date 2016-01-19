import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './book-info.hbs';

function requireOne(container) {
    let checkboxes = container.querySelectorAll('input[type=checkbox]'),
        checkCount = 0,
        setClass = function () {
            if (checkCount > 0) {
                container.classList.remove('invalid');
            } else {
                container.classList.add('invalid');
            }
        },
        onChange = function (e) {
            if (e.target.checked) {
                checkCount += 1;
            } else {
                checkCount -= 1;
            }
            setClass();
        };

    for (let i=0; i<checkboxes.length; ++i) {
        let el = checkboxes[i];

        el.addEventListener('change', onChange);
    }
    setClass();
}

@props({
    template: template
})
export default class BookInfoView extends BaseView {
    constructor(prefix) {
        super();
        this.templateHelpers = {
            prefix: prefix
        };
    }
    onRender() {
        let checkboxGroup = this.el.querySelector('.require-one');

        requireOne(checkboxGroup);

        let noneBox = this.el.querySelector('input[type="checkbox"][value="None"]');

        noneBox.addEventListener('change', () => {
            let boxes = checkboxGroup.querySelectorAll('input[type=checkbox]:not([value="None"])');

            for (let i=0; i<boxes.length; ++i) {
                let box=boxes[i];

                if (noneBox.checked && box.checked) {
                    box.checked = false;
                    box.dispatchEvent(new Event('change'));
                }
                box.disabled = noneBox.checked;
            }
        });
        let prefix = this.templateHelpers.prefix,
            otherBox = this.el.querySelector('input[type="checkbox"][value="other"]'),
            otherText = this.el.querySelector(`input[type="text"][name="${prefix}[other]"]`);

        otherBox.addEventListener('change', () => {
            if (!otherBox.checked) {
                otherText.value = '';
            }
            otherText.disabled = !otherBox.checked;
        });
        otherText.disabled = !otherBox.checked;
    }
}
