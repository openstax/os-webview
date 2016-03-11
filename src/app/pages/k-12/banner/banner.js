import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './banner.hbs';

@props({
    template: template
})
export default class Banner extends BaseView {}
