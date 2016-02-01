import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './get-this-title.hbs';

@props({
    template: template
})
export default class GetThisTitle extends BaseView {}
