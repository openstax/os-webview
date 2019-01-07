import $ from '~/helpers/$';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import Header1 from './header-1';
import SupplementalForm from './supplemental-form';
import Header2 from './header-2';
import Calculator from '~/components/calculator/calculator';
import {description as template} from './adoption-confirmation.html';
import css from './adoption-confirmation.css';

const spec = {
    template,
    css,
    view: {
        classes: ['adoption-confirmation', 'page']
    },
    regions: {
        header: '.hero',
        content: '.followup-form'
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class AdoptionConfirmation extends BaseClass {

    onLoaded() {
        const email = history.state ? history.state.email : '';

        this.regions.header.attach(new Header1());
        this.regions.content.attach(new SupplementalForm(email, () => this.loadFinalThankYou()));
    }

    loadFinalThankYou() {
        this.regions.header.attach(new Header2());
        this.regions.content.attach(new Calculator());
        $.scrollTo(document.body);
    }

}
