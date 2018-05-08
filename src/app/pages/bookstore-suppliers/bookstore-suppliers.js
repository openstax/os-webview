import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {description as template} from './bookstore-suppliers.html';

export default class BookstoreSuppliers extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['bookstore-suppliers', 'page']
        };
        this.css = `/app/pages/bookstore-suppliers/bookstore-suppliers.css?${VERSION}`;
        this.slug = 'pages/bookstores';
        this.model = {};
    }

    onLoaded() {
        // TODO: Remove when back end is implemented
        this.pageData = {
            headline: 'Need to order print copies for your campus bookstore?',
            subhead: 'We\'ve got you covered. Below is a list of your print options.',
            subhead2: `If you are an instructor or student and would like to order lorem ipsum
                boogedy boogedy shoo...`,
            suppliers: [
                {
                    name: 'indiCo',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
                    logoUrl: 'http://via.placeholder.com/150x80',
                    buttonUrl: 'http://openstax.org',
                    buttonText: 'Get started'
                },
                {
                    name: 'Toppan',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
                    logoUrl: 'http://via.placeholder.com/150x80',
                    buttonUrl: 'http://openstax.org',
                    buttonText: 'Learn more'
                },
                {
                    name: 'Nebraska Book Company',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
                    logoUrl: 'http://via.placeholder.com/150x80',
                    buttonUrl: 'http://openstax.org',
                    buttonText: 'Learn more'
                },
                {
                    name: 'XanEdu',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
                    logoUrl: 'http://via.placeholder.com/150x80',
                    buttonUrl: 'http://openstax.org',
                    buttonText: 'Learn more'
                }
            ]
        };
        this.onDataLoaded();
    }

    onDataLoaded() {
        this.model = {
            headline: this.pageData.headline,
            subhead: this.pageData.subhead,
            subhead2: this.pageData.subhead2,
            suppliers: this.pageData.suppliers,
            cardsClass: (this.pageData.suppliers.length % 2) ? 'by-twos' : ''
        };
        this.update();
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}
