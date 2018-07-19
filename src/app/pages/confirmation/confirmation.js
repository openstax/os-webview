import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
import $ from '~/helpers/$';
import userModel from '~/models/usermodel';
import Popup from '~/components/popup/popup';
import Errata from '~/pages/errata/errata';
import Detail from '~/pages/errata/detail/detail';
import SurveyRequest from '~/components/survey-request/survey-request';
import {description as template} from './confirmation.html';

const applyLink = `${settings.accountHref}/faculty_access/apply?r=${encodeURIComponent(settings.apiOrigin)}`;

const models = {
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
        headline: 'Thank you',
        adoptionQuestion: 'Please add info@openstax.org to your address book. You\'ll' +
        ' receive an email from us soon.',
        adoptionUrl: '/subjects',
        adoptionLinkText: 'Back to the books',
        studentImage: 'student-chemistry.png',
        outlineButton: true
    }
};

export default class Confirmation extends Controller {

    init() {
        document.title = 'Thanks! - OpenStax';
        this.template = template;
        this.css = `/app/pages/confirmation/confirmation.css?${VERSION}`;
        this.view = {
            classes: ['confirmation-page', 'page']
        };
        this.regions = {
            popup: 'pop-up',
            detail: 'detail-block'
        };

        this.referringPage = window.location.pathname.replace('/confirmation/', '');
        if (this.referringPage === window.location.pathname) {
            this.referringPage = window.location.pathname
                .replace('-confirmation', '')
                .replace(/^\//, '');
        }
        if (this.referringPage === 'adoption') {
            this.view.classes.push('adoption');
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
        if (this.referringPage === 'interest') {
            const surveyRequest = new SurveyRequest();

            this.regions.detail.attach(surveyRequest);
        }
    }

}
