import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './products-boxes.hbs';

@props({template})
export default class ProductsBoxes extends BaseView {
    constructor(options = {}) {
        super();

        this.templateHelpers = {
            products: options.products || []
        };

        if (options.subject === 'ap') {
            this.templateHelpers.ourBooksBlurb = `Our college­ level textbooks for Advanced Placement®
                courses are peer-reviewed, completely free online, and will soon be available for a
                very low cost in print.`;
            this.templateHelpers.subjectExplore = '/ap';
        } else {
            this.templateHelpers.ourBooksBlurb = `All of our textbooks are peer-reviewed and absolutely
                free. They meet standard scope and sequence requirements and come in web view, PDF,
                iBooks, or a low cost print version.`;
            this.templateHelpers.subjectExplore = '';
        }

        if (options.products.indexOf('Concept Coach') !== -1) {
            this.templateHelpers.cc = true;
        }
    }
}
