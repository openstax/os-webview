import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import selectHandler from '~/handlers/select';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import settings from 'settings';
import Share from '~/components/share/share';
import {description as template} from './give.html';

const studentModel = {
    headline: 'Help Us Make More Free Books!',
    subhead: `Like having a textbook for free? Your donation helps us provide access
    to free textbooks for more students like you.`,
    amounts: [5, 10, 15, 25, 50, 100]
};

const thankYouModel = {
    headline: 'Thanks for your support!',
    subhead: `Tell your social networks that you support free, peer-reviewed,
    openly licensed textbooks by OpenStax so others can benefit from OpenStax
    resources!`,
    amounts: null
};

export default class Give extends CMSPageController {

    static description =
    'Your donation helps us create opportunities for students to have access to quality ' +
    'free and low-cost educational materials. Your gift changes lives.';

    init() {
        document.title = 'Give - OpenStax';
        this.template = template;
        this.model = {
            headline: '',
            subhead: '',
            paymentMethods: [],
            thankYouUrl: `${settings.apiOrigin}/give-confirmation`,
            amounts: [5, 25, 50, 100, 500, 1000],
            page2: history.state && (history.state.page === 2),
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            },
            recurring: history.state && history.state.recurring || '',
            billingFields: ['NAME', 'EMAIL_ADDRESS', 'STREET1', 'STREET2', 'CITY',
            'STATE', 'POSTAL_CODE', 'COUNTRY'],
            touchnet: () => this.model.useTestingSite ? settings.touchnet.test : settings.touchnet.prod,
            useTestingSite: settings.testingEnvironment
        };
        this.slug = 'pages/give';
        this.regions = {
            'share': '.share-buttons'
        };

        this.css = '/app/pages/give/give.css';
        this.view = {
            classes: ['give-page']
        };

        shell.showLoader();

        window.addEventListener('popstate', this.togglePage);
    }

    handleQueryString() {
        const queryDict = $.parseSearchString(window.location.search);
        const handleAmount = (amount) => {
            router.replaceState({
                // A string goes to Other
                amount: amount || '?',
                page: amount ? 2 : 1,
                page2: false
            });
            if (amount) {
                this.togglePage();
            }
        };

        if ('student' in queryDict) {
            Object.assign(this.model, studentModel);
        } else if (window.location.pathname === '/give-confirmation') {
            Object.assign(this.model, thankYouModel);
            try {
                localStorage.visitedGive = Date.now();
            } catch (e) { }

            this.regions.share.attach(new Share(`${settings.apiOrigin}/give`,
            'Contribute to OpenStax (I did)!'));
            this.model.isThanks = true;

            this.el.querySelector('[name=first_name]').value = localStorage.getItem('donation:first_name');
            this.el.querySelector('[name=last_name]').value = localStorage.getItem('donation:last_name');
            this.el.querySelector('[name=email]').value = localStorage.getItem('donation:email');
            this.el.querySelector('[name=phone]').value = localStorage.getItem('donation:phone');
            this.el.querySelector('[name=Donation_Amount__c]').value = localStorage.getItem('donation:amount');
            document.getElementById('donation-update').submit();
            localStorage.removeItem('donation:first_name');
            localStorage.removeItem('donation:last_name');
            localStorage.removeItem('donation:email');
            localStorage.removeItem('donation:phone');
            localStorage.removeItem('donation:amount');
        }
        if ('amount' in queryDict) {
            handleAmount(+queryDict.amount);
        }
    }

    onDataLoaded() {
        const modelToPageDataMap = {
            headline: 'intro_heading',
            subhead: 'intro_description',
            otherPaymentHeading: 'other_payment_methods_heading',
            giveCtaText: 'give_cta',
            giveCtaUrl: 'give_cta_link'
        };

        for (const modelKey of Object.keys(modelToPageDataMap)) {
            this.model[modelKey] = this.pageData[modelToPageDataMap[modelKey]];
        }
        this.handleQueryString();
        this.model.queryStringHandled = true;

        const pmReg = new RegExp(/^payment_method_(\d)_(\w+)/);
        const populatePaymentMethods = () => {
            for (const pmKey of Object.keys(this.pageData).filter((key) => pmReg.test(key))) {
                const [indexStr, contentKey] = pmKey.match(pmReg).slice(1);
                const index = +indexStr - 1;
                const value = this.pageData[pmKey];

                if (value) {
                    const alreadyCreated = this.model.paymentMethods[+index];
                    const pmObj = alreadyCreated || {};

                    pmObj[contentKey] = value;
                    if (!alreadyCreated) {
                        this.model.paymentMethods[+index] = pmObj;
                    }
                }
            }
        };

        populatePaymentMethods();
        this.update();
        $.insertHtml(this.el, this.model);
        shell.hideLoader();
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
            if (this.el) {
                this.update();
            }
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
            amount: this.model.selectedAmount,
            recurring: this.model.recurring
        });
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('change')
    updateOnChange() {
        this.update();
    }

    @on('change #use-testing-site')
    toggleUseTestingSite(event) {
        this.model.useTestingSite = !this.model.useTestingSite;
        this.update();
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalid = this.el.querySelector('form :invalid');

        // Copy fields to BILL_* fields
        const elements = Array.from(this.el.querySelectorAll('input,select'));
        /* eslint camelcase: 0 */
        const fieldMap = {
            email: 'BILL_EMAIL_ADDRESS',
            mailing_address: 'BILL_STREET1',
            mailing_address2: 'BILL_STREET2',
            mailing_city: 'BILL_CITY',
            mailing_state: 'BILL_STATE',
            mailing_zip: 'BILL_POSTAL_CODE',
            mailing_country: 'BILL_COUNTRY'
        };

        for (const el of elements) {
            const name = el.name.toLowerCase();

            if (name in fieldMap) {
                const billEl = this.el.querySelector(`[name=${fieldMap[name]}]`);

                billEl.value = el.value;
            }
        }
        // BILL_NAME is special
        this.el.querySelector('[name="BILL_NAME"]').value = ['First_Name', 'Last_Name']
            .map((name) => this.el.querySelector(`[name=${name}]`).value)
            .join(' ');

        this.hasBeenSubmitted = true;
        if (invalid) {
            event.preventDefault();
            this.update();
        } else {
            localStorage.setItem('donation:first_name', this.el.querySelector('[name=First_Name]').value);
            localStorage.setItem('donation:last_name', this.el.querySelector('[name=Last_Name]').value);
            localStorage.setItem('donation:email', this.el.querySelector('[name=Email]').value);
            localStorage.setItem('donation:phone', this.el.querySelector('[name=Phone]').value);
            localStorage.setItem('donation:amount', this.el.querySelector('[name=AMT]').value);
        }
    }

}
