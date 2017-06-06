import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
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
                        imageUrl: 'http://via.placeholder.com/150x150',
                        headline: 'Choose your book',
                        description: '<p>Lorem ipsum about book</p>'
                    },
                    {
                        imageUrl: 'http://via.placeholder.com/150x150',
                        headline: 'Get your instructor resources',
                        description: '<p>Lorem ipsum about resources</p>'
                    },
                    {
                        imageUrl: 'http://via.placeholder.com/150x150',
                        headline: 'Choose your learning technology',
                        description: '<p>Lorem ipsum about technology</p>'
                    }]
            },
            tutor: {
                headline: 'The new frontier in education',
                subhead: 'Improve how your students learn with research-based technology - for only $10.',
                description: '<p>OpenStax Tutor is a personalized learning tool that helps students focus ' +
                    'their studying efforts and gives instructors greater insigt into blah blah blah...',
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
    }

    onDataLoaded() {
        $.insertHtml(this.el, this.model);
        shell.hideLoader();
    }

}
