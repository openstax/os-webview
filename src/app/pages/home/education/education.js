import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './education.hbs';

@props({
    template: template
})
export default class Education extends BaseView {}
