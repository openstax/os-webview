import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import selectHandler from '~/handlers/select';
import $ from '~/helpers/$';
import settings from 'settings';
import {description as template} from './give.html';

const studentModel = {
    headline: 'Help Us Make More Free Books!',
    subhead: `Like having a textbook for free? Your donation helps us provide access
    to free textbooks for more students like you.`,
    amounts: [5, 10, 15, 25, 50, 100]
};

const thankYouModel = {
    headline: 'Thank you for giving to OpenStax!',
    subhead: `Your donation helps us to develop and spread the word about our books
    and adaptive learning tools. With your help, we’re giving hundreds of thousands
    of students access to high-quality educational materials.`,
    amounts: null
};

export default class Give extends Controller {

    static description =
    'Your donation helps us create opportunities for students to have access to quality ' +
    'free and low-cost educational materials. Your gift changes lives.';

    init() {
        const queryDict = $.parseSearchString(window.location.search);

        document.querySelector('head meta[name="description"]').content = Give.description;
        document.title = 'Give - OpenStax';
        this.template = template;
        this.model = {
            headline: 'Give to OpenStax',
            subhead: `Your donation helps us create opportunities for students to have
            access to quality free and low-cost educational materials. With your gift,
            we can create and revise our free textbooks, finetune our adaptive learning
            tools, and spread the word to more instructors and students. Your donation
            changes lives.`,
            thankYouUrl: `${settings.apiOrigin}/give?thanks`,
            amounts: [5, 25, 50, 100, 500, 1000],
            page2: history.state && (history.state.page === 2)
        };
        if ('student' in queryDict) {
            Object.assign(this.model, studentModel);
        } else if ('thanks' in queryDict) {
            Object.assign(this.model, thankYouModel);
        }
        this.css = '/app/pages/give/give.css';
        this.view = {
            classes: ['give-page']
        };

        window.addEventListener('popstate', this.togglePage);
    }

    onLoaded() {
        document.title = this.model.amounts ? 'Give - OpenStax' : 'Thanks - OpenStax';
        if (this.model.amounts) {
            const amount = history.state && history.state.amount || 5;

            this.setAmount(amount);
        }

        selectHandler.setup(this);
    }

    setAmount(amount) {
        this.model.selectedAmount = amount;
        this.model.otherAmount = this.model.amounts.includes(amount) ? null : amount;
        this.update();
    }

    togglePage() {
        if (this.model && history.state.page) {
            this.model.page2 = !this.model.page2;
            this.update();
        }
    }

    detach() {
        super.detach();
        window.removeEventListener('popstate', this.togglePage);
    }

    @on('click .amount')
    selectAmount(event) {
        this.setAmount(+event.target.dataset.value);
    }

    @on('change .amount-input')
    setCustomAmount(event) {
        this.setAmount(+event.target.value);
    }

    @on('submit .preform')
    loadPage2(event) {
        event.preventDefault();
        router.navigate('/give/form', {
            path: '/give',
            page: 2,
            amount: this.model.selectedAmount
        });
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalids = this.el.querySelectorAll('input:invalid');

        this.hasBeenSubmitted = true;
        if (invalids.length) {
            event.preventDefault();
            this.update();
        }
    }

}
