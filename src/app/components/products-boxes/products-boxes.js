import {Controller} from 'superb.js';
import ProductBox from './product-box/product-box';
import css from './product-boxes.css';

export default class ProductsBoxes extends Controller {

    init(productData) {
        this.template = () => null;
        this.css = css;
        this.view = {
            classes: ['products-boxes', 'boxed-row']
        };

        this.boxes = productData.map((product) => new ProductBox(product));
    }

    onLoaded() {
        for (const box of this.boxes) {
            this.regions.self.append(box);
        }
    }

}
