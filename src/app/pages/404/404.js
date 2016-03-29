import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './404.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    templateHelpers: {strips}
})

export default class NotFound extends BaseView {}
