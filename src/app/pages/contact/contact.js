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
export default class Contact extends BaseView {
    @on('submit')
    validateAndSend() {
        let selectedSubject = this.el.querySelector('select').value,
            selectedOption = subjectOptions.filter((item) => item[0] === selectedSubject)[0];

        this.el.querySelector('[name="to_address"]').value = selectedOption[1];
        this.el.querySelector('[name="subject"]').value = selectedOption[2];
    }

    onRender() {
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            new SingleSelect().replace(ss);
        }
    }
}
