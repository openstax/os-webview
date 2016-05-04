import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './finished-verify.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    css: '/app/pages/finished-verify/finished-verify.css',
    templateHelpers: {strips}
})
export default class FinishedVerify extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page');
    }

}
