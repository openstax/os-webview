import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './contact-thank-you.hbs';

@props({
    template: template,
    css: '/app/pages/contact-thank-you/contact-thank-you.css'
})
export default class ContactThankYou extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page');
    }

}
