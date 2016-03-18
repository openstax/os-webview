import BaseView from '~/helpers/backbone/view';
// import Calculator from '~/components/calculator/calculator';
import {props} from '~/helpers/backbone/decorators';
import {template} from './faculty-confirmation.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    templateHelpers: {
        strips
    }
//    regions: {
//        calculator: '.calculator'
//    }
})
export default class FacultyConfirmation extends BaseView {

    onRender() {
        this.el.classList.add('confirmation-page');
//        this.regions.calculator.append(new Calculator());
    }

}
