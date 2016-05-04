import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './footer.hbs';

@props({
    template: template,
    css: '/app/components/shell/footer/footer.css'
})
class Footer extends BaseView {}

let footer = new Footer();

export default footer;
