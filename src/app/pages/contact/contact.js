import BaseView from '~/helpers/backbone/view';
import SingleSelect from '~/components/single-select/single-select';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './contact.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const subjectOptions = [
    ['General', 'info@openstax.org', 'General OpenStax Question'],
    ['Adopting OpenStax Textbooks', 'info@openstax.org', 'Adopting OpenStax Textbooks'],
    ['Concept Coach', 'ccsupport@openstax.org', 'Concept Coach Question'],
    ['Tutor', 'tutorsupport@openstax.org', 'OpenStax Tutor Question'],
    ['CNX', 'cnx@cnx.org', 'CNX Question'],
    ['College/University Partnerships', 'info@openstax.org', 'College/University Partnerships'],
    ['Media Inquiries', 'info@openstax.org', 'Media Inquiries.'],
    ['Foundational Support', 'richb@rice.edu, dcwill@rice.edu, mka2@rice.edu', 'Foundation'],
    ['OpenStax Allies', 'info@openstax.org', 'Allies'],
    ['Website', 'info@openstax.org', 'Website']
];

@props({
    template: template,
    templateHelpers: {
        strips,
        options: subjectOptions.map((option) => option[0])
    }
})
export default class Accessibility extends BaseView {
    @on('submit')
    validateAndSend(e) {
        /* -- When we can submit, we'll use these
        let selectedSubject = this.el.querySelector('select').value,
            selectedOption = subjectOptions.filter((item) => item[0] === selectedSubject)[0],
            toAddress = selectedOption[1],
            subjectLine = selectedOption[2];
        */

        e.preventDefault();
    }

    onRender() {
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            new SingleSelect().replace(ss);
        }
    }
}
