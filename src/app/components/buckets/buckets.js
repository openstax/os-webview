import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './buckets.hbs';

@props({
    template: template
})
export default class Buckets extends BaseView {}
