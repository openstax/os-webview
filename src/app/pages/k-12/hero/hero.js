import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './hero.hbs';

@props({
    template: template,
    css: '/app/pages/k-12/hero/hero.css'
})
export default class Hero extends BaseView {}
