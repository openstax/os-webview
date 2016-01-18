import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './tos.hbs';

@props({
    template: template
})
export default class Tos extends BaseView {}
