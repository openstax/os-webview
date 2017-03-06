import CMSPageController from '~/controllers/cms';
import {makeDocModel} from '~/models/usermodel';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
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
        shell.showLoader();
    }

    onDataLoaded() {
        const d = this.pageData;
        const slug = window.location.hash.substr(1);
        const item = d.questions.find((q) => q.slug === slug);

        if (item) {
            item.isOpen = true;
        }

        this.model = {
            heading: d.intro_heading,
            subhead: d.intro_description,
            questions: d.questions
        };
        this.update();


        if (item) {
            const targetEl = document.getElementById(slug);

            $.scrollTo(targetEl);
        }

        // Load documents
        for (const q of this.model.questions) {
            if (q.document) {
                makeDocModel(q.document).load().then((data) => {
                    q.documentUrl = data.file;
                    q.documentTitle = data.title;
                    this.update();
                });
            }
        }
        shell.hideLoader();
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
