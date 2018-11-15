import settings from 'settings';
import shell from '~/components/shell/shell';
import CMSPageController from '~/controllers/cms';
import {description as template} from './adopters.html';
import css from './adopters.css';

export default class Adopters extends CMSPageController {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['adopters-page', 'text-content'],
            tag: 'main'
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
