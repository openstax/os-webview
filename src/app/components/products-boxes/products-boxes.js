import {Controller} from 'superb.js';
import ProductBox from './product-box/product-box';

export default class ProductsBoxes extends Controller {

    init(productData) {
        this.template = () => null;
        this.css = '/app/components/products-boxes/products-boxes.css';
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
