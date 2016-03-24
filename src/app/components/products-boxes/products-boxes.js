import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './products-boxes.hbs';

@props({
    template: template
})
export default class ProductsBoxes extends BaseView {}
