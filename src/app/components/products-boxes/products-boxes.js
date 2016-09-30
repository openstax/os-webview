import {Controller} from 'superb';
import ProductBox from './product-box/product-box';

const boxData = {
    books: {
        name: 'books',
        title: 'Our Books',
        linkText: 'Explore Our Subjects',
        blurb: `All of our textbooks are peer-reviewed and absolutely free.
        They meet standard scope and sequence requirements and come in web
        view, PDF, on iBooks, or a low cost print version.`,
        url: '/subjects'
    },
    ap: {
        name: 'books',
        title: 'Books for AP<sup>&reg;</sup> Courses',
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
        url: 'http://cc.openstax.org',
        blurb: `We're integrating our adaptive learning technology with our
        college textbooks to improve student reading comprehension at zero cost.`
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

export default class ProductsBoxes extends Controller {

    init(options = {}) {
        this.template = () => null;
        this.css = '/app/components/products-boxes/products-boxes.css';
        this.view = {
            classes: ['products-boxes']
        };

        this.boxes = options.products.map((product) => {
            return new ProductBox(boxData[product]);
        });
    }

    onLoaded() {
        for (const box of this.boxes) {
            this.regions.self.append(box);
        }
    }

}
