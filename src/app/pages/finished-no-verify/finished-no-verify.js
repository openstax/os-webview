import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './finished-no-verify.hbs';

@props({template})
export default class FinishedNoVerify extends BaseView {}
