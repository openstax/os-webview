import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './calculator.hbs';

@props({
    template: template
})
export default class Calculator extends BaseView {
    @on('change #student-count')
    updateStudentCount(e) {
        let newVal = e.target.value;

        for (let i of [1, 2, 3]) {
            let r = this.rows[i],
                td = r.querySelectorAll('td')[2];

            td.textContent = newVal;
            this.calculateRow(r, i);
        }
    }

    calculateRow(row, rowIndex) {
        let tds = row.querySelectorAll('td'),
            tPrice = tds[1].querySelector('input').value,
            osInput = tds[0].querySelector('input'),
            osPrice = osInput ? osInput.value : 0,
            stuInput = tds[2].querySelector('input'),
            stuCount = +(stuInput ? stuInput.value : tds[2].textContent);

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
        let addCalculateAndRestyleChangeEvent = (row, inputs, node) => {
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

        for (let r of this.rows) {
            let inputs = r.querySelectorAll('input');

            for (let i of inputs) {
                addCalculateAndRestyleChangeEvent(r, inputs, i);
            }
            this.calculateRow(r, Array.from(this.rows).indexOf(r)); // Initial calculate
        }
    }

    onRender() {
        this.rows = this.el.querySelectorAll('tbody tr');
        this.hookUpCalculator();
    }

}
