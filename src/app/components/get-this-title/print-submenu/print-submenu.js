import {Controller} from 'superb';
import Remover from '~/components/remover/remover';
import {description as template} from './print-submenu.html';

export default class PrintSubmenu extends Controller {

    init(pdfData, stateModel) {
        this.template = template;
        this.templateHelpers = pdfData; // FIX: This makes no sense
        this.stateModel = stateModel;
    }

    onLoaded() {
        this.el.classList.add('print-submenu');
        this.regions.self.el = this.el;
        this.regions.self.append(new Remover(() => this.stateModel.set('currentSubmenu', null)));
    }

}
