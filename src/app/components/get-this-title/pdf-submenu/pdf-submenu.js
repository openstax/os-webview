import BaseView from '~/helpers/backbone/view';
import Remover from '~/components/remover/remover';
import {props} from '~/helpers/backbone/decorators';
import {template} from './pdf-submenu.hbs';

@props({
    template: template
})
export default class PdfSubmenu extends BaseView {
    constructor(pdfData, stateModel) {
        super();
        this.templateHelpers = pdfData;
        this.stateModel = stateModel;
    }

    onRender() {
        this.el.classList.add('pdf-submenu');
        this.regions.self.el = this.el;
        this.regions.self.append(new Remover(() => this.stateModel.set('currentSubmenu', null)));
    }
}
