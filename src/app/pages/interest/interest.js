import BaseView from '~/helpers/backbone/view';
import salesforceModel from '~/models/salesforce-model';
import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './interest.hbs';

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
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        let varName = event.target.name;

        if (varName) {
            salesforceModel.set(varName, event.target.value);
        }
    }

    onRender() {
        this.el.classList.add('text-content');
        salesforceModel.prefill(this.el);
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            new TagMultiSelect().replace(ms);
        }
    }
}
