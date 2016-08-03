import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {published as bookTitles} from '~/models/book-titles';
import partners from '~/models/partners';
import salesforce from '~/models/salesforce';
import {description as template} from './adoption.html';

export default class AdoptionForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/adoption/adoption.css';
        this.view = {
            classes: ['adoption-page', 'page']
        };
        const titles = bookTitles.map((titleData) =>
            titleData.text ? titleData : {
                text: titleData,
                value: titleData
            }
        );

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
        document.title = 'Adoption Form - OpenStax';
        selectHandler.setup(this);
    }

}
