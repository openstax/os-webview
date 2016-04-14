import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './loader.hbs';

@props({
    template: template
})
class Loader extends BaseView {}

let loader = new Loader();

export default loader;
