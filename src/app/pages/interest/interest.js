import BaseView from '~/helpers/backbone/view';
import salesforceModel from '~/models/salesforce-model';
import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './interest.hbs';

let bookTitles = [
    'Algebra and Trigonometry',
    'American Government',
    'Anatomy and Physiology',
    'Astronomy',
    'Biology',
    'Calculus',
    'Chemistry',
    'College Algebra',
    'College Physics',
    'College Physics for AP® Courses',
    'Concepts of Biology',
    'Elementary Algebra',
    'Intermediate Algebra',
    'Introduction to Sociology',
    'Introduction to Sociology 2e',
    'Introductory Statistics',
    'Microbiology',
    'Prealgebra',
    'Precalculus',
    'Principles of Economics',
    'Principles of Macroeconomics',
    'Principles of Macroeconomics for AP® Courses',
    'Principles of Microeconomics',
    'Principles of Microeconomics for AP® Courses',
    'Psychology',
    'University Physics',
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
