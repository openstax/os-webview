import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './education.hbs';

@props({
    template: template,
    css: '/app/pages/home/education/education.css'
})
export default class Education extends BaseView {}
