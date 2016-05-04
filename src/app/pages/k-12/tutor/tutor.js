import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './tutor.hbs';

@props({
    template: template,
    css: '/app/pages/k-12/tutor/tutor.css'
})
export default class Tutor extends BaseView {}
