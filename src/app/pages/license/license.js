import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './license.hbs';
import {template as strips} from '~/components/strips/strips.hbs';
import './license.css!';

@props({
    template: template,
    templateHelpers: { strips }
})
export default class License extends BaseView {}
