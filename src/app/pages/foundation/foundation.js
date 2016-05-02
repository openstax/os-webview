import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './foundation.hbs';
import {template as strips} from '~/components/strips/strips.hbs';
import './foundation.css!';

@props({
    template,
    templateHelpers: {strips}
})

export default class Foundation extends BaseView {
    onRender() {
        this.el.classList.add('foundation-page');
    }
}
