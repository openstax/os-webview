import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './contact-thank-you.hbs';
import './contact-thank-you.css!';

@props({template})
export default class ContactThankYou extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page');
    }

}
