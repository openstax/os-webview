import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './faculty-section.hbs';

@props({template})
export default class FacultySection extends BaseView {}
