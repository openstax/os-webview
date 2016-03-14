import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './faculty-verification.hbs';

@props({
    template: template,
    templateHelpers: {
        urlOrigin: window.location.origin
    }
})
export default class FacultyVerificationForm extends BaseView {
    onRender() {
        this.el.classList.add('faculty-verification-form');
    }
}
