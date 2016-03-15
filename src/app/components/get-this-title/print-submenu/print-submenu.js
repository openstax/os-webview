import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './print-submenu.hbs';

@props({
    template: template
})
export default class PrintSubmenu extends BaseView {
    @on('click .remover')
    removeMe() {
        this.stateModel.set('currentSubmenu', null);
    }

    constructor(pdfData, stateModel) {
        super();
        this.templateHelpers= pdfData;
        this.stateModel = stateModel;
    }

    onRender() {
        this.el.classList.add('print-submenu');
    }
}
