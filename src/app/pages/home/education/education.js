import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './education.hbs';
import './education.css!';

@props({
    template: template
})
export default class Education extends BaseView {}
