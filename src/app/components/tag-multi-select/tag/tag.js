import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './tag.html';

export default class Tag extends Controller {

    init(model) {
        this.model = model;
        this.template = template;
        this.view = {
            tag: 'div'
        };
        this.templateHelpers = {
            label: model.get('label')
        };
    }

    @on('click .remover')
    deselect() {
        this.model.set('selected', false);
    }

}
