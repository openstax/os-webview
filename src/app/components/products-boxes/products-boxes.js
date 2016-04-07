import BaseView from '~/helpers/backbone/view';
import ProductBox from '~/components/product-box/product-box';
import {props} from '~/helpers/backbone/decorators';
import {template} from './products-boxes.hbs';

@props({
    template,
    regions: {
        'boxes': '.content'
    }
})
export default class ProductsBoxes extends BaseView {
    constructor(options = {}) {
        super();

        this.templateHelpers = {
            products: options.products || []
        };

        let boxData = {
            books: {
                name: 'books',
                title: 'Our Books',
                linkText: 'Explore Our Subjects',
                blurb: `All of our textbooks are peer-reviewed and absolutely free.
                They meet standard scope and sequence requirements and come in web
                view, PDF, iBooks, or a low cost print version.`,
                url: '/subjects'
            },
            ap: {
                name: 'books',
                title: 'Books for Advanced Placement<sup>&reg;</sup>',
                linkText: 'Explore Our Subjects',
                blurb: `Our college­ level textbooks for Advanced Placement<sup>&reg;</sup>
                    courses are peer-reviewed, completely free online, and will soon be
                    available for a very low cost in print.`,
                url: '/subjects/ap'
            },
            'Concept Coach': {
                name: 'cc',
                title: 'Concept Coach',
                linkText: 'Learn More',
                url: '//cc.openstax.org',
                blurb: `We're integrating our adaptive learning technology with our
                college textbooks to improve student reading comprehension at zero cost.`
            },
            'Tutor': {
                name: 'tutor',
                title: 'OpenStax Tutor Pilot',
                linkText: 'Sign up',
                url: '/contact?subject=OpenStax Tutor Pilot Sign-up',
                blurb: `We’re recruiting for our Fall 2016 OpenStax Tutor high school pilot.
                Sign up to partner with us in perfecting this full-service digital courseware
                and help impact the future of education.
`
            },
            'OpenStax CNX': {
                name: 'cnx',
                title: 'OpenStax CNX',
                linkText: 'Discover Free Content',
                url: '//cnx.org',
                blurb: `OpenStax CNX is an open library of educational content where anyone
                can contribute. View, share, and add material that you can remix and reuse
                for your course.`
            }
        };

        this.boxes = options.products.map((product) => new ProductBox(boxData[product]));
    }

    onRender() {
        for (let box of this.boxes) {
            this.regions.boxes.append(box);
        }
    }
}
