import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import bookTitles from '~/models/book-titles';
import {description as template} from './interest.html';

export default class InterestForm extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/interest/interest.css';
        this.view = {
            classes: ['interest-form']
        };
        const titles = bookTitles.map((titleData) =>
            titleData.text ? titleData : {
                text: titleData,
                value: titleData
            }
        );

        this.model = { titles };
    }

    onLoaded() {
        selectHandler.setup(this);
    }

}
