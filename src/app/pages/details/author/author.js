import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './author.hbs';

@props({
    template: template
})
export default class Author extends BaseView {
    constructor(data) {
        super();
        this.templateHelpers = data;
    }
}
