import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './hero.hbs';
import './hero.css!';

@props({template})
export default class Hero extends BaseView {}
