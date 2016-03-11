import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './faculty-confirmation.hbs';

@props({
    template: template
})
export default class InterestConfirmation extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page', 'text-content');
    }

}
