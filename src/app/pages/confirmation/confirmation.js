import {Controller} from 'superb';
import settings from 'settings';
import $ from '~/helpers/$';
import Popup from '~/components/popup/popup';
import Calculator from '~/components/calculator/calculator';
import Detail from '~/pages/errata/detail/detail';
import {description as template} from './confirmation.html';

const applyLink = `${settings.accountHref}/faculty_access/apply?r=${encodeURIComponent(settings.apiOrigin)}`;

const models = {
    adoption: {
        headline: 'Thanks! You\'re A Textbook Hero',
        topParagraph: `Our free digital textbooks and integrated resources are
        yours to use. You are joining thousands of educators in providing greater
        access to quality learning resources for your students.`,
        adoptionQuestion: 'Have you adopted another OpenStax book?',
        adoptionUrl: '/adoption',
        adoptionLinkText: 'Add another book',
        subjectLinkText: 'Go back to our books',
        studentImage: 'student-algebra.png'
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
    errata: {
        headline: 'Thanks for your help!',
        adoptionQuestion: `Your contribution helps keep OpenStax resources high quality
        and up to date. We sent you an email confirming your submission.`
    },
    interest: {
        headline: 'Thanks for telling us about yourself!',
        topParagraph: `Our goal is to increase access for students to get the learning materials
        they need to succeed. We'll be sure to send you more information about our
        free textbooks and low-cost learning tools that are revolutionizing
        classrooms across the country and the world.`,
        adoptionQuestion: 'Have you been verified as an instructor?',
        adoptionUrl: applyLink,
        adoptionLinkText: 'Get verified',
        subjectLinkText: 'Explore our books',
        studentImage: 'student-chemistry.png'
    }
};

export default class Confirmation extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/confirmation/confirmation.css';
        this.view = {
            classes: ['confirmation-page', 'page']
        };
        this.regions = {
            popup: 'pop-up',
            calculator: 'savings-calculator',
            detail: 'detail-block'
        };

        this.referringPage = window.location.pathname.replace('/confirmation/', '');
        if (this.referringPage === window.location.pathname) {
            this.referringPage = window.location.pathname
            .replace('-confirmation', '')
            .replace(/^\//, '');
        }
        this.model = models[this.referringPage];
    }

    onLoaded() {
        if (this.model.popupText) {
            this.regions.popup.attach(new Popup(this.model.popupText));
        }
        if (['adoption', 'interest'].includes(this.referringPage)) {
            this.regions.calculator.attach(new Calculator());
        }
        if (this.referringPage === 'errata') {
            const queryDict = $.parseSearchString(window.location.search);

            Detail.detailPromise(queryDict.id).then((detail) => {
                this.regions.detail.attach(new Detail(detail));
            });
        }
    }

}
