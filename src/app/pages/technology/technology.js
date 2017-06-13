import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import FormSelect from '~/components/form-select/form-select';
import shell from '~/components/shell/shell';
import {on} from '~/helpers/controller/decorators';
import {bookPromise} from '~/models/book-titles';
import {description as template} from './technology.html';

export default class Accessibility extends CMSPageController {

    init() {
        this.template = template;
        this.css = '/app/pages/technology/technology.css';
        this.view = {
            classes: ['technology-page', 'page']
        };
        this.slug = 'pages/accessibility'; // TODO: replace with technology
        shell.showLoader();
        this.regions = {
            bookSelector: 'book-selector'
        };
        this.model = {
            banner: {
                headline: 'Technology',
                description: '<p>Higher ed meets high tech. This is everything we want' +
                ' to say about this in about 20 words.</p>',
                button: {
                    url: '#',
                    text: 'Learn More'
                },
                student: '#'
            },
            steps: {
                headline: 'Selecting the right technology is as easy as 1 2 3',
                items: [
                    {
                        headline: 'Choose your book',
                        selector: new FormSelect({
                            name: 'book',
                            placeholder: 'Select your OpenStax book',
                            validationMessage: () => ''
                        })
                    },
                    {
                        headline: 'Get your instructor resources',
                        description: 'View Instructor Resources',
                        hash: '#faculty-resources'
                    },
                    {
                        headline: 'Choose your learning technology',
                        description: 'View Learning Technologies',
                        hash: '#partner-resources'
                    }]
            },
            tutor: {
                headline: 'The new frontier in education',
                subhead: 'Improve how your students learn with research-based technology - for only $10.',
                description: '<p>OpenStax Tutor is a personalized learning tool that helps students focus' +
                    ' their studying efforts and gives instructors greater insight into student' +
                    ' performance, all integrated with OpenStax content.',
                buttons: [
                    {
                        url: '#',
                        text: 'Learn More',
                        description: 'some alt text'
                    },
                    {
                        url: '#',
                        text: 'Go to OpenStax Tutor',
                        description: 'some alt text'
                    }
                ]
            }
        };
    }

    onLoaded() {
        document.title = 'Technology - OpenStax';
        this.regions.bookSelector.attach(this.model.steps.items[0].selector);
        bookPromise.then((data) => {
            const options = data.map((obj) => ({label: obj.title, value: obj.meta.slug}))
            .sort((a, b) => a.label.localeCompare(b.label));

            this.model.steps.items[0].selector.setOptions(options);
        });
    }

    onDataLoaded() {
        $.insertHtml(this.el, this.model);
        shell.hideLoader();
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
