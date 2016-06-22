import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './calculator.html';

export default class Calculator extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/calculator/calculator.css';
    }

    @on('change #student-count')
    updateStudentCount(e) {
        const newVal = e.target.value;

        for (const i of [1, 2, 3]) {
            const r = this.rows[i];
            const td = r.querySelectorAll('td')[2];

            td.textContent = newVal;
            this.calculateRow(r, i);
        }
    }

    calculateRow(row, rowIndex) {
        const tds = row.querySelectorAll('td');
        let tPrice = tds[1].querySelector('input').value;
        const osInput = tds[0].querySelector('input');
        const osPrice = osInput ? osInput.value : 0;
        const stuInput = tds[2].querySelector('input');
        const stuCount = +(stuInput ? stuInput.value : tds[2].textContent);

        if (rowIndex === 1) {
            // full-price book costs plus half-price book costs
            tPrice *= (0.9 + 0.5 + 0.25)/3 + (0.1 + 0.5 + 0.75)/6;
        }

        tds[3].textContent = ((tPrice - osPrice) * stuCount * 6).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    hookUpCalculator() {
        const addCalculateAndRestyleChangeEvent = (row, inputs, node) => {
            node.addEventListener('change', () => {
                this.calculateRow(row, Array.from(this.rows).indexOf(row));
                if (!(row === this.rows[0] && node === inputs[1])) {
                    node.value = (+node.value).toLocaleString('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            });
        };

        for (const r of this.rows) {
            const inputs = r.querySelectorAll('input');

            for (const i of inputs) {
                addCalculateAndRestyleChangeEvent(r, inputs, i);
            }
            this.calculateRow(r, Array.from(this.rows).indexOf(r)); // Initial calculate
        }
    }

    onLoaded() {
        this.rows = this.el.querySelectorAll('tbody tr');
        this.hookUpCalculator();
    }

}
