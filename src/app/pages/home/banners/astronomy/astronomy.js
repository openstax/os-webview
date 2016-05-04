import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './astronomy.hbs';

@props({
    template: template,
    css: '/app/pages/home/banners/astronomy/astronomy.css'
})
export default class Astronomy extends BaseView {}
