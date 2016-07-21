import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {published as titles} from '~/models/book-titles';
import partners from '~/models/partners';
import salesforce from '~/models/salesforce';
import Select from '~/components/select/select';
import {description as template} from './adoption.html';

export default class AdoptionForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/adoption/adoption.css';
        this.view = {
            classes: ['adoption-page', 'page']
        };
        this.model = {
            titles,
            partners,
            salesforce: {
                adoption: {
                    name: salesforce.adoptionName,
                    options: salesforce.adoption(['adopted', 'recommended'])
                }
            }
        };
    }

    onLoaded() {
        const selects = this.el.querySelectorAll('select');

        for (const select of selects) {
            new Select({
                select: select,
                placeholder: select.previousSibling
            });
        }
    }

}
