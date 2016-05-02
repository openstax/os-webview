import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './chemistry.hbs';
import './chemistry.css!';

@props({
    template: template
})
export default class Chemistry extends BaseView {}
