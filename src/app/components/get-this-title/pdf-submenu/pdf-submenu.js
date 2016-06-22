import {Controller} from 'superb';
import Remover from '~/components/remover/remover';
import {description as template} from './pdf-submenu.html';

export default class PdfSubmenu extends Controller {

    init(pdfData, stateModel) {
        this.template = template;
        this.templateHelpers = pdfData; // FIX: Makes no sense
        this.stateModel = stateModel;
        this.view = {
            classes: ['pdf-submenu']
        };
    }

    onLoaded() {
        // FIX: Isn't self already set?
        this.regions.self.el = this.el;
        this.regions.self.append(new Remover(() => this.stateModel.set('currentSubmenu', null)));
    }

}
