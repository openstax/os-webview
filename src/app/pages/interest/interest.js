import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './interest.hbs';

const otherBoxSelector = '.other[type="checkbox"]',
    otherTextSelector = 'input[name$="[other]"]';

let bookTitles = [
    'Algebra and Trigonometry',
    'Anatomy and Physiology',
    'Biology',
    'Chemistry',
    'College Algebra',
    'College Physics',
    'College Physics for AP® Courses',
    'Concepts of Biology',
    'Introduction to Sociology',
    'Introduction to Sociology 2e',
    'Introductory Statistics',
    'Prealgebra',
    'Precalculus',
    'Principles of Economics',
    'Principles of Macroeconomics',
    'Principles of Macroeconomics for AP® Courses',
    'Principles of Microeconomics',
    'Principles of Microeconomics for AP® Courses',
    'Psychology',
    'U.S. History'
];

@props({
    template: template,
    templateHelpers: {
        titles: bookTitles,
        urlOrigin: window.location.origin
    }
})
export default class InterestForm extends BaseView {

    @on(`change ${otherBoxSelector}`)
    otherBoxChange(e) {
        let otherText = this.el.querySelector(otherTextSelector),
            otherBox = e.delegateTarget;

        if (!otherBox.checked) {
            otherText.value = '';
        }
        otherText.disabled = !otherBox.checked;
    }

    @on('change .require-one input[type=checkbox]')
    checkValid() {
        for (let group of this.el.querySelectorAll('.require-one')) {
            let oneChecked = group.querySelector('input:checked');

            group.classList.toggle('invalid', oneChecked === null);
        }
    }

    onRender() {
        this.el.classList.add('text-content');
        this.el.querySelector(otherTextSelector).disabled = true;
        this.checkValid();
    }
}
