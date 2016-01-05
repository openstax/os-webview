import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './footer.hbs';

@props({
    el: '#footer',
    template: template
})
export default class Footer extends BaseView {}
