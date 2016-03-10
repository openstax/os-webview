import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './adoption-confirmation.hbs';

function hookUpCalculator(tableBody) {
    let studentCountEl = tableBody.querySelector('#student-count'),
        rows = tableBody.querySelectorAll('tr');

    function calculateRow(row, rowIndex) {
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

    studentCountEl.addEventListener('change', () => {
        let newVal = studentCountEl.value;

        for (let i of [1, 2, 3]) {
            let r = rows[i],
                td = r.querySelectorAll('td')[2];

            td.textContent = newVal;
            calculateRow(r, i);
        }
    });

    let addCalculateAndRestyleChangeEvent = (row, inputs, node) => {
        node.addEventListener('change', () => {
            calculateRow(row, Array.from(rows).indexOf(row));
            if (!(row === rows[0] && node === inputs[1])) {
                node.value = (+node.value).toLocaleString('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        });
    };

    for (let r of rows) {
        let inputs = r.querySelectorAll('input');

        for (let i of inputs) {
            addCalculateAndRestyleChangeEvent(r, inputs, i);
        }
        calculateRow(r, Array.from(rows).indexOf(r)); // Initial calculate
    }
}

function hookUpDonationBox(el) {
    let slider = el.querySelector('input[type="range"]'),
        box = el.querySelector('input[type="number"]'),
        messageEl = el.querySelector('.amount-message'),
        levels = [10, 15, 20, 25, 50, 75, 100, 250, 500, 1000, 2500, 5000, 10000],
        messages = [
            'OpenStax is a 10 in my book (suggested donation)',
            'Thanks for saving me hundreds of dollars!',
            'My ATM wants you to have this',
            'Abe Lincoln would be proud (and amazed by ATMs)',
            'Hey OpenStax, give a printed copy to a school in need',
            'Here\'s something to help keep these books free!',
            'Giving back never felt so good',
            'On me: fill a school library with your books!',
            'Go buy yourself a fancy new translation!',
            'The next section of an OpenStax book is on me!',
            'The next chapter of an OpenStax book is on me!',
            'Bill Gates II, at your service',
            'WOWWWWWW!!!!'
        ],
        setMessage = (about) => {
            if (+levels[about] === +box.value) {
                messageEl.textContent = messages[about];
            } else {
                messageEl.textContent = `$${box.value} seems just about right!`;
            }
        },
        validateValue = () => {
            if (+box.value < +box.min) {
                box.classList.add('invalid');
                messageEl.textContent = 'We can\'t process less than $10';
            } else {
                box.classList.remove('invalid');
            }
        };

    slider.addEventListener('input', () => {
        box.value = levels[slider.value];
        box.dispatchEvent(new Event('input'));
    });
    box.addEventListener('input', () => {
        let about = levels.length - 1;

        for (let amount of levels) {
            if (amount > box.value) {
                about = levels.indexOf(amount) - 1;
                break;
            }
        }

        slider.value = about;
        setMessage(about);
        validateValue();
    });
    box.value = levels[slider.value];
    box.dispatchEvent(new Event('input'));
}

@props({
    template: template
})
export default class AdoptionConfirmation extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page');
        this.el.classList.add('text-content');
        hookUpCalculator(this.el.querySelector('#savings-calculator tbody'));
        hookUpDonationBox(document.getElementById('support-box'));
    }

}
