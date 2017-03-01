import {Controller} from 'superb';
import $ from '~/helpers/$';
import settings from 'settings';
import Share from '~/components/share/share';
import {on} from '~/helpers/controller/decorators';
import Spinner from '~/components/spinner/spinner';
import {description as template} from './calculator.html';

export default class Calculator extends Controller {

    init(referringPage) {
        this.template = template;
        this.css = '/app/components/calculator/calculator.css';
        this.view = {
            classes: ['calculator']
        };
        this.model = {
            activeBlock: null,
            isValid: {},
            widthClass: {},
            values: {},
            product: () => this.model.values.students * this.model.values.dollars,
            calculated: false
        };
        this.referringPage = referringPage;
    }

    onLoaded() {
        const spinners = this.el.querySelectorAll('spinner');
        const Region = this.regions.self.constructor;

        for (const s of spinners) {
            const region = new Region(s, this);
            // Allow dot-notation, arbitrarily deep, with no eval
            const itemIds = s.dataset.item.split('.');
            const index = itemIds.pop();
            const valueContainer = itemIds.reduce((a, b) => a[b], this.model);
            const parentThis = this;

            const props = {
                get value() {
                    return valueContainer[index];
                },
                set value(newValue) {
                    valueContainer[index] = newValue;
                    parentThis.update();
                }
            };

            region.attach(new Spinner(props));
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

        region.attach(
            new Share(
                settings.apiOrigin,
                messages[this.referringPage] + commonMessageTail
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
