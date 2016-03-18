import BaseView from '~/helpers/backbone/view';
// import Calculator from '~/components/calculator/calculator';
import {props} from '~/helpers/backbone/decorators';
import {template} from './adoption-confirmation.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

/*
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
*/

@props({
    template: template,
    templateHelpers: {
        strips
    }
//    regions: {
//        calculator: '.calculator'
//    }
})
export default class AdoptionConfirmation extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page');
//        this.regions.calculator.append(new Calculator());
    }

}
