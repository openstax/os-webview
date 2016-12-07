import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import Spinner from '~/components/spinner/spinner';
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

    onLoaded() {
        const spinners = this.el.querySelectorAll('spinner');
        const Region = this.regions.self.constructor;

        for (const s of spinners) {
            const region = new Region(s, this);
            // Allow dot-notation, arbitrarily deep, with no eval
            const itemIds = s.dataset.item.split('.');
            const index = itemIds.pop();
            const valueContainer = itemIds.reduce((a, b) => a[b], this.model);
            const parentThis = this;

            const props = {
                get value() {
                    return valueContainer[index];
                },
                set value(newValue) {
                    valueContainer[index] = newValue;
                    parentThis.update();
                }
            };

            region.attach(new Spinner(props));
        }
    }

}
