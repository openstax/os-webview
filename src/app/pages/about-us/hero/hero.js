import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './hero.hbs';

@props({
    template: template,
    css: '/app/pages/about-us/hero/hero.css'
})
export default class Hero extends BaseView {}
