import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './license.hbs';

@props({
    template: template
})
export default class License extends BaseView {}
