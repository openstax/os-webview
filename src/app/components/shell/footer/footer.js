import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './footer.hbs';

@props({
    template: template
})
class Footer extends BaseView {}

let footer = new Footer();

export default footer;
