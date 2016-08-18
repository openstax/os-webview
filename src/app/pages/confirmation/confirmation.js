import {Controller} from 'superb';
import {description as template} from './confirmation.html';

const models = {
    adoption: {
        headline: 'Thank you for adopting OpenStax!',
        topParagraph: `Our free digital textbooks and integrated resources are
        yours to use. You are joining thousands of educators in providing greater
        access to quality learning resources for your students.`,
        adoptionQuestion: 'Have you adopted another OpenStax book?',
        adoptionUrl: '/adoption',
        adoptionLinkText: 'Add another book',
        subjectLinkText: 'Go back to our books'
    },
    compCopy: {
        headline: 'Thank you for requesting a download from iBooks.',
        topParagraph: `A member of our Customer Service team will contact you with
        a code for your free download from iBooks within one to two business days.`,
        adoptionQuestion: 'Have you adopted an OpenStax book?',
        adoptionUrl: '/adoption',
        adoptionLinkText: 'Adopt a book',
        subjectLinkText: 'Explore our books'
    },
    contact: {
        headline: 'Thanks for contacting us',
        topParagraph: `We love hearing from you! We've received your message and will
        get back to you within one business day.`,
        adoptionQuestion: 'Have you looked at our books lately?',
        adoptionUrl: '/subjects',
        adoptionLinkText: 'Check out our subjects'
    },
    faculty: {
        headline: 'Thank you for applying for an instructor account!',
        topParagraph: `We manually verify all instructor account requests to ensure that educator
        resources stay in the right hands, so we'll email you in the next 3 to 4
        business days about your approval. Once approved, you will be able to access
        all of our instructor-only resources.`,
        adoptionQuestion: 'Have you adopted an OpenStax book?',
        adoptionUrl: '/adoption',
        adoptionLinkText: 'Adopt a book',
        subjectLinkText: 'Explore our books'
    },
    give: {
        headline: 'Thank you for giving to OpenStax! ',
        topParagraph: `Your donation helps us to develop and spread the word about our
        books and adaptive learning tools. With your help, we’re giving hundreds of
        thousands of students access to high-quality educational materials.`,
        adoptionUrl: '/impact',
        adoptionLinkText: 'See our impact'
    },
    interest: {
        headline: 'Thanks for telling us about yourself!',
        topParagraph: `Our goal is to increase access for students to get the learning materials
        they need to succeed. We'll be sure to send you more information about our
        free textbooks and low-cost learning tools that are revolutionizing
        classrooms across the country and the world.`,
        adoptionQuestion: 'Have you been verified as an instructor?',
        adoptionUrl: '/faculty-verification',
        adoptionLinkText: 'Get verified',
        subjectLinkText: 'Explore our books'
    },
    unverified: {
        headline: 'Your new account has been created. Thank you for joining the OpenStax community!',
        topParagraph: 'Do you need access to instructor-only resources?',
        topLinkText: 'Get your account verified',
        topLinkUrl: '/finish-profile',
        adoptionQuestion: 'Have you adopted an OpenStax book?',
        adoptionUrl: '/adoption',
        adoptionLinkText: 'Adopt a book',
        subjectLinkText: 'Explore our books'
    }

};

export default class Confirmation extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/confirmation/confirmation.css';
        this.view = {
            classes: ['confirmation-page', 'page']
        };

        const referringPage = window.location.search.substr(1);

        this.model = models[referringPage];
    }

}
