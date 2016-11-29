import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './calculator.html';

function moneyFormat(num) {
    return num.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    });
}

export default class Calculator extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/calculator/calculator.css';
        this.view = {
            classes: ['calculator']
        };
        this.model = {
            studentCount: 1000,
            savings: (item) => ((item.price - item.osPrice) * this.model.studentCount * 3),
            ebook: {
                osPrice: 0,
                price: 100,
                savings: () => moneyFormat(this.model.savings(this.model.ebook))
            },
            print: {
                osPrice: 41,
                price: 220,
                savings: () => {
                    const pDiff = this.model.savings(this.model.print);

                    // Full-price costs (3 years) and used-price costs (3 years @ 50%)
                    return moneyFormat(pDiff * (0.9 + 0.5 + 0.25)/3 + (0.1 + 0.5 + 0.75)/6);
                }
            },
            printPlus: {
                osPrice: 91,
                price: 245,
                savings: () => moneyFormat(this.model.savings(this.model.printPlus))
            },
            ePlus: {
                osPrice: 50,
                price: 145,
                savings: () => moneyFormat(this.model.savings(this.model.ePlus))
            }
        };
    }

    @on('input [data-item]')
    updateItem(e) {
        /* eslint no-eval: 0 */
        eval(`this.model.${e.target.dataset.item} = ${e.target.value}`);
        this.update();
    }

}
