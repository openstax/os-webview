import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './finished-verify.hbs';

@props({template})
export default class FinishedVerify extends BaseView {}
