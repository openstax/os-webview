import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './accessibility-statement.hbs';

@props({
    template: template
})
export default class Accessibility extends BaseView {}
