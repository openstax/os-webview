import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {published as titles} from '~/models/book-titles';
import salesforce from '~/models/salesforce';
import partners from '~/models/partners';
import {description as template} from './renew.html';

export default class AdoptionForm extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['adoption-form']
        };
        this.model = {
            titles,
            partners,
            salesforce: salesforce.adoption([
                'adopted',
                'recommended'
            ])
        };
    }

    onLoaded() {
        selectHandler.setup(this);
    }

}
