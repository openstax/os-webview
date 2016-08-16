import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import settings from 'settings';
import {template} from './give.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template,
    templateHelpers: {
        strips,
        thankYouUrl: `${settings.apiOrigin}/give-thank-you`,
        amounts: [5, 10, 15, 25, 50, 100]
    },
    css: '/app/pages/give/give.css'
})
export default class Give extends BaseView {

    onRender() {
        this.el.classList.add('give-page');
    }

    setAmount(amount) {
        const oldSelected = this.el.querySelector('.amount.selected');
        const newSelected = this.el.querySelector(`.amount[data-value="${amount}"]`);
        const otherValue = this.el.querySelector('.amount-input');

        this.el.querySelector('[name="AMT"]').value = amount;
        if (oldSelected) {
            oldSelected.classList.remove('selected');
        }
        if (newSelected) {
            newSelected.classList.add('selected');
        }
        if (amount !== otherValue.value) {
            otherValue.value = '';
        }
    }

    @on('click .amount')
    selectAmount(event) {
        this.setAmount(event.target.dataset.value);
    }

    @on('change .amount-input')
    setCustomAmount(event) {
        this.setAmount(event.target.value);
    }

}
