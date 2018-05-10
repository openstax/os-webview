import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import Header1 from './header-1';
// Temporarily replacing:
// import SupplementalForm from './supplemental-form';
// with
import SurveyRequest from '~/components/survey-request/survey-request';
import Header2 from './header-2';
import Calculator from '~/components/calculator/calculator';
import {description as template} from './adoption-confirmation.html';

export default class AdoptionConfirmation extends Controller {

    init() {
        this.template = template;
        this.css = `/app/pages/adoption-confirmation/adoption-confirmation.css?${VERSION}`;
        this.view = {
            classes: ['adoption-confirmation', 'page']
        };
        this.regions = {
            header: '.hero',
            content: '.followup-form'
        };
    }

    onLoaded() {
        const email = history.state ? history.state.email : '';

        this.regions.header.attach(new Header1());
        // this.regions.content.attach(new SupplementalForm(email, () => this.loadFinalThankYou()));
        this.regions.content.attach(new SurveyRequest());
    }

    loadFinalThankYou() {
        this.regions.header.attach(new Header2());
        this.regions.content.attach(new Calculator());
        $.scrollTo(document.body);
    }

}
