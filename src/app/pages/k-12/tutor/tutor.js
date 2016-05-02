import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './tutor.hbs';
import './tutor.css!';

@props({
    template: template
})
export default class Tutor extends BaseView {}
