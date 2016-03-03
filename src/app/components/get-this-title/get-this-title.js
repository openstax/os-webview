import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './get-this-title.hbs';

@props({
    template: template
})
export default class GetThisTitle extends BaseView {
    constructor(data) {
        super();
        this.templateHelpers = {
            pdfLink: data.high_resolution_pdf_url || data.low_resolution_pdf_url,
            ibookLink: data.ibook_link,
            webviewLink: data.webview_link
        };
    }
}
