import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './foundation.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    css: '/app/pages/foundation/foundation.css',
    templateHelpers: {strips}
})

export default class Foundation extends BaseView {

    static metaDescription = () => `OpenStax is supported by our philanthropic
        sponsors like the Bill & Melinda Gates Foundation, the William and Flora
        Hewlett Foundation, and more.`;

    onRender() {
        this.el.classList.add('foundation-page');
    }

}
