import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import settings from 'settings';
import Share from '~/components/share/share';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './calculator.html';
import css from './calculator.css';

export default class Calculator extends Controller {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['calculator']
        };
        this.model = {
            activeBlock: null,
            introText: 'Calculate how much your students will save this year',
            isValid: {},
            widthClass: {},
            values: {},
            product: () => this.model.values.students * this.model.values.dollars,
            calculated: false
        };

        if ((/interest/).test(window.location.pathname)) {
            this.model.introText = 'Calculate how much students save each year when you adopt OpenStax';
        }
    }

    @on('click .block')
    setFocus(e) {
        const input = e.delegateTarget.querySelector('input');

        input.focus();
    }

    @on('focusin input.giant')
    setActive(e) {
        this.model.activeBlock = e.target.name;
        this.update();
    }

    @on('focusout input.giant')
    setInactive(e) {
        if (this.model.activeBlock === e.target.name) {
            this.model.activeBlock = null;
            this.update();
        }
    }

    @on('input .giant')
    setValid(e) {
        const name = e.target.name;
        const value = e.target.value;

        this.model.isValid[name] = value > 0;
        this.model.widthClass[name] = `w${value.length}-chars`;
        this.model.values[name] = value;
        this.model.calculated = false;
        this.update();
    }

    attachShareButtons() {
        const Region = this.regions.self.constructor;
        const el = this.el.querySelector('share-buttons');
        const region = new Region(el, this);
        const messages = {
            adoption: `I saved my students $${this.model.product()} by adopting`,
            interest: `I can save my students $${this.model.product()} with`
        };
        const commonMessageTail = ' an OpenStax textbook! They\'re high quality' +
            ' and available free online at';
        const referredBy = ['adoption', 'interest']
            .find((name) => window.location.pathname.includes(name)) || 'interest';

        region.attach(
            new Share(
                `${settings.apiOrigin}/`,
                `${messages[referredBy]}${commonMessageTail}`
            ));
    }

    @on('click .calculate')
    doCalculate() {
        this.model.calculated = true;
        this.model.waiting = true;
        this.update();
        $.scrollTo(this.el.querySelector('.output'))
            .then(() => {
                this.model.waiting = false;
                this.update();
                this.attachShareButtons();
            });
    }

}
