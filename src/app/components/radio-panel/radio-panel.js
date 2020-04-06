import WrappedJsx from '~/controllers/jsx-wrapper';
import mix from '~/helpers/controller/mixins';
import RadioPanelJsx from './radio-panel.jsx';
import busMixin from '~/helpers/controller/bus-mixin';
import {on} from '~/helpers/controller/decorators';

export default class extends mix(WrappedJsx).with(busMixin) {

    init(items) {
        super.init(RadioPanelJsx, {
            items,
            selectedValue: null,
            updateSelected: (value) => this.updateSelected(value)
        });
        this.view = {
            classes: ['filter-buttons']
        };
    }

    updateSelected(value) {
        this.updateProps({
            selectedValue: value
        });
        this.emit('change', value);
    }

    // This is for when it is in mobile/dropdown mode
    @on('click')
    toggleActive() {
        this.el.classList.toggle('active');
    }

}
