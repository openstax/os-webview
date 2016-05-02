import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './accessibility-statement.hbs';
import {template as strips} from '~/components/strips/strips.hbs';
import './accessibility-statement.css!';

@props({
    template: template,
    templateHelpers: {strips}
})
export default class Accessibility extends BaseView {}
