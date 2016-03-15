import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './foundation.hbs';

@props({
    template: template
})

export default class Foundation extends BaseView {}
