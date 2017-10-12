import settings from 'settings';
import shell from '~/components/shell/shell';
import CMSPageController from '~/controllers/cms';
import {render as template} from './adopters.html';

export default class Adopters extends CMSPageController {

    init() {
        this.template = template;
        this.css = '/app/pages/adopters/adopters.css';
        this.view = {
            classes: ['adopters-page', 'text-content']
        };
        this.model = {};
        this.slug = 'adopters';
        shell.showLoader();
    }

    onDataLoaded() {
        const results = this.pageData.results || this.pageData;

        this.model.adopters = results.sort((a, b) => a.name.localeCompare(b.name));
        this.update();
        shell.hideLoader();
    }

}
