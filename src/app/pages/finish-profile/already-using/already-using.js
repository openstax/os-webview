import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './already-using.hbs';

@props({
    template: template
})
export default class AlreadyUsing extends BaseView {}
