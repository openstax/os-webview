import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import FormSelect from '~/components/form-select/form-select';
import shell from '~/components/shell/shell';
import {on} from '~/helpers/controller/decorators';
import {bookPromise} from '~/models/book-titles';
import {description as template} from './technology.html';

export default class Accessibility extends CMSPageController {

    static description = 'OpenStax has teamed up with our partners to offer a ' +
        'variety of low-cost, innovative learning tools and courseware that ' +
        'integrate with OpenStax textbooks.';

    init() {
        this.template = template;
        this.css = `/app/pages/technology/technology.css?${VERSION}`;
        this.view = {
            classes: ['technology-page', 'page']
        };
        this.slug = 'pages/technology';
        shell.showLoader();
    }

    onLoaded() {
        document.title = 'Technology - OpenStax';
    }

    attachBookSelector() {
        const Region = this.regions.self.constructor;
        const target = this.el.querySelector('book-selector');
        const region = new Region(target, this);

        bookPromise.then((data) => {
            const options = data.map((obj) => ({label: obj.title, value: obj.meta.slug}))
                .sort((a, b) => a.label.localeCompare(b.label));

            this.model.steps.items[0].selector.setOptions(options);
            region.attach(this.model.steps.items[0].selector);
        });
    }

    onDataError(e) {
        console.warn(e);
    }

    onDataLoaded() {
        const data = this.pageData;

        this.model = {};
        this.model.banner = {
            headline: data.intro_heading,
            description: data.intro_description,
            button: {
                url: '#steps',
                text: data.banner_cta
            }
        };
        this.model.steps = {
            headline: data.select_tech_heading,
            items: [
                {
                    selector: new FormSelect({
                        name: 'book',
                        placeholder: data.select_tech_step_1,
                        validationMessage: () => ''
                    })
                },
                {
                    description: data.select_tech_step_2,
                    hash: '?Instructor%20resources'
                },
                {
                    description: data.select_tech_step_3,
                    hash: '?Instructor%20resources#technology-options'
                }
            ]
        };
        this.model.tutor = {
            headline: data.new_frontier_heading,
            subhead: data.new_frontier_subheading,
            description: data.new_frontier_description,
            buttons: [
                {
                    url: data.new_frontier_cta_link_1,
                    text: data.new_frontier_cta_1
                },
                {
                    url: data.new_frontier_cta_link_2,
                    text: data.new_frontier_cta_2
                }
            ]
        };
        this.update();
        this.attachBookSelector();
        $.insertHtml(this.el, this.model);
        shell.hideLoader();
        $.scrollToHash();
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e);
    }

    @on('change select[name="book"]')
    updateLinks(e) {
        const slug = e.target.value;
        const url = slug ? `/details/books/${slug}` : null;
        const items = this.model.steps.items;

        items[1].url = items[2].url = url;
        this.update();
    }

}
