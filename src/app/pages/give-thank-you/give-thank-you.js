import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './give-thank-you.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    templateHelpers: {strips},
    css: '/app/pages/give-thank-you/give-thank-you.css'
})
export default class GiveThankYou extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page');
    }

}
