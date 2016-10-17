import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './faq.html';

export default class FAQ extends CMSPageController {

    static description = 'Frequently Asked Questions about OpenStax';

    init() {
        document.title = 'FAQ - OpenStax';
        this.slug = 'pages/faq';
        this.template = template;
        this.css = '/app/pages/faq/faq.css';
        this.view = {
            classes: ['faq-page', 'page']
        };

        this.model = {};
    }

    onDataLoaded() {
        const d = this.pageData;

        this.model = {
            heading: d.intro_heading,
            subhead: d.intro_description,
            questions: d.questions
        };
        this.update();
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

    @on('click .question')
    toggleQuestion(event) {
        const index = +event.delegateTarget.dataset.item;
        const q = this.model.questions[index];

        q.isOpen = !q.isOpen;
        this.update();
    }

}
