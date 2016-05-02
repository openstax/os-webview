import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './astronomy.hbs';
import './astronomy.css!';

@props({
    template: template
})
export default class Astronomy extends BaseView {}
