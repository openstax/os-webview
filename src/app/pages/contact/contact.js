import LoadingView from '~/helpers/backbone/loading-view';
import PageModel from '~/models/pagemodel';
import SingleSelect from '~/components/single-select/single-select';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './contact.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const subjectOptions = [
    ['General', 'General OpenStax Question'],
    ['Adopting OpenStax Textbooks', 'Adopting OpenStax Textbooks'],
    ['Concept Coach', 'Concept Coach Question'],
    ['OpenStax Tutor Support', 'OpenStax Tutor Question'],
    ['OpenStax CNX', 'CNX Question'],
    ['Donations', 'Donations'],
    ['College/University Partnerships', 'College/University Partnerships'],
    ['Media Inquiries', 'Media Inquiries.'],
    ['Foundational Support', 'Foundation'],
    ['OpenStax Partners', 'Partners'],
    ['Website', 'Website']
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
        options: subjectOptions.map((option) => option[0]),
        urlOrigin: window.location.origin
    }
})
export default class Contact extends LoadingView {
    @on('submit')
    validateAndSend(e) {
        let selectedSubject = this.el.querySelector('select').value,
            selectedOption = subjectOptions.filter((item) => item[0] === selectedSubject)[0];

        this.el.querySelector('[name="subject"]').value = selectedOption[1];
        if (!e.target.checkValidity()) {
            e.target.classList.add('has-been-submitted');
            e.preventDefault();
        }
    }

    static metaDescription = () => `If you have a question or feedback about our books,
        OpenStax Tutor, Concept Coach, partnerships, or any other topic, contact us here.
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
