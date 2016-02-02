import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './biology.hbs';

@props({
    template: template
})
export default class Biology extends BaseView {}
