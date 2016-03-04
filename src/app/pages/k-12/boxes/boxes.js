import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './boxes.hbs';

@props({
    template: template
})
export default class Boxes extends BaseView {}
