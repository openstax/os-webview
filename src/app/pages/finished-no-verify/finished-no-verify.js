import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './finished-no-verify.hbs';
import {template as strips} from '~/components/strips/strips.hbs';


@props({
    template: template,
    templateHelpers: {strips}
})
export default class FinishedNoVerify extends BaseView {}
