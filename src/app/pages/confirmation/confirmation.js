import {Controller} from 'superb';
import settings from 'settings';
import $ from '~/helpers/$';
import userModel from '~/models/usermodel';
import Popup from '~/components/popup/popup';
import Calculator from '~/components/calculator/calculator';
import Errata from '~/pages/errata/errata';
import Detail from '~/pages/errata/detail/detail';
import {render as template} from './confirmation.html';

const applyLink = `${settings.accountHref}/faculty_access/apply?r=${encodeURIComponent(settings.apiOrigin)}`;

const models = {
    adoption: {
        headline: 'Thanks! You\'re A Textbook Hero',
        adoptionQuestion: 'Have you adopted another OpenStax book?',
        adoptionUrl: '/adoption',
        adoptionLinkText: 'Add another book',
        subjectLinkText: 'Go back to our books',
        studentImage: 'student-algebra.png'
    },
    compCopy: {
        headline: 'Thank you for requesting a download from iBooks.',
        adoptionQuestion: 'Have you adopted an OpenStax book?',
        adoptionUrl: '/adoption',
        adoptionLinkText: 'Adopt a book',
        subjectLinkText: 'Explore our books'
    },
    'bulk-order': {
        headline: 'Thanks for contacting us',
        simpleMessage: 'We\'ve received your order form.'
    },
    contact: {
        headline: 'Thanks for contacting us',
        adoptionQuestion: 'Have you looked at our books lately?',
        adoptionUrl: '/subjects',
        adoptionLinkText: 'Check out our subjects'
    },
    errata: {
        headline: 'Thanks for your help!',
        adoptionQuestion: `Your contribution helps keep OpenStax resources high quality
        and up to date.`,
        belowHeader: {
            text: 'Have more errata to submit?',
            buttons: []
        }
    },
    interest: {
        headline: 'Thanks for telling us about yourself!',
        adoptionQuestion: 'Have you been verified as an instructor?',
        adoptionUrl: applyLink,
        adoptionLinkText: 'Get verified',
        subjectLinkText: 'Explore our books',
        studentImage: 'student-chemistry.png'
    }
};

export default class Confirmation extends Controller {

    init() {
        document.title = 'Thanks! - OpenStax';
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
        if (this.referringPage === 'errata') {
            this.userPromise = userModel.load();
        }
    }

    onLoaded() {
        if (this.model.popupText) {
            this.regions.popup.attach(new Popup(this.model.popupText));
        }
        if (['adoption', 'interest'].includes(this.referringPage)) {
            this.regions.calculator.attach(new Calculator(this.referringPage));
        }
        if (this.referringPage === 'errata') {
            const queryDict = $.parseSearchString(window.location.search);

            Detail.detailPromise(queryDict.id).then((detail) => {
                this.model.belowHeader.buttons = [{
                    text: `submit ${detail.bookTitle} errata`,
                    colorScheme: 'white-on-blue',
                    url: `/errata/form?book=${encodeURIComponent(detail.bookTitle)}`
                }];
                this.update();
                Errata.setDisplayStatus(detail);
                this.regions.detail.attach(new Detail(detail));
            });

            this.model.errataId = queryDict.id;
            this.userPromise.then((response) => {
                this.model.defaultEmail = response.email;
                this.update();
            });
        }
    }

}
