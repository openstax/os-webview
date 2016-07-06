import LoadingView from '~/helpers/backbone/loading-view';
import csrfModel from '~/models/csrfmodel';
import PageModel from '~/models/pagemodel';
import SingleSelect from '~/components/single-select/single-select';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './contact.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const subjectOptions = [
    ['General', 'info@openstax.org', 'General OpenStax Question'],
    ['Adopting OpenStax Textbooks', 'info@openstax.org', 'Adopting OpenStax Textbooks'],
    ['Concept Coach', 'ccsupport@openstax.org', 'Concept Coach Question'],
    ['OpenStax Tutor Pilot Sign-up', 'tutorpilot@openstax.org', 'I’m interested in piloting OpenStax Tutor'],
    ['OpenStax Tutor Support', 'tutorsupport@openstax.org', 'OpenStax Tutor Question'],
    ['OpenStax CNX', 'cnx@cnx.org', 'CNX Question'],
    ['Donations', 'info@openstax.org', 'Donations'],
    ['College/University Partnerships', 'info@openstax.org', 'College/University Partnerships'],
    ['Media Inquiries', 'info@openstax.org', 'Media Inquiries.'],
    ['Foundational Support', 'richb@rice.edu, dcwill@rice.edu, mka2@rice.edu', 'Foundation'],
    ['OpenStax Partners', 'info@openstax.org', 'Partners'],
    ['Website', 'info@openstax.org', 'Website']
];

let contactDataPromise = new PageModel().fetch({
    data: {
        type: 'pages.ContactUs',
        fields: ['title', 'tagline', 'mailing_header', 'mailing_address', 'phone_number']
    }
});

@props({
    template: template,
    css: '/app/pages/contact/contact.css',
    templateHelpers: {
        strips,
        options: subjectOptions.map((option) => option[0])
    }
})
export default class Contact extends LoadingView {
    @on('submit')
    validateAndSend(e) {
        let selectedSubject = this.el.querySelector('select').value,
            selectedOption = subjectOptions.filter((item) => item[0] === selectedSubject)[0];

        this.el.querySelector('[name="to_address"]').value = selectedOption[1];
        this.el.querySelector('[name="subject"]').value = selectedOption[2];
        if (!e.target.checkValidity()) {
            e.target.classList.add('has-been-submitted');
            e.preventDefault();
        }
    }

    static metaDescription = () => `If you have a question or feedback about our books,
        Concept Coach, Tutor, partnerships, media, or any other topic, contact us here.
        We’d love to hear from you!`;

    onRender() {
        let queryString = window.location.search,
            matched = queryString.match(/^\?subject=([^&]+)/),
            ss = this.el.querySelector('select:not([multiple])'),
            proxySs = new SingleSelect();

        proxySs.replace(ss);
        if (matched) {
            proxySs.set(decodeURIComponent(matched[1]));
        }
        csrfModel.fetch().then((result) => {
            this.el.querySelector('[name="csrfmiddlewaretoken"]').value = result.csrf_token;
        });
        contactDataPromise.then((result) => {
            let data = result.pages[0];

            for (let field of Object.keys(data)) {
                let el = this.el.querySelector(`[data-id="${field}"]`);

                if (el) {
                    el.innerHTML = data[field];
                }
            }
        });
        this.otherPromises.push(contactDataPromise);
        super.onRender();
    }
}
