import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './strips-and-filter.html';
import css from './strips-and-filter.css';
import RadioPanel from '~/components/radio-panel/radio-panel';
import busMixin from '~/helpers/controller/bus-mixin';

const spec = {
    template,
    css,
    view: {
        classes: ['strips-and-filter']
    }
};

export default class extends componentType(spec, busMixin) {

    init() {
        super.init();
        this.radioPanel = new RadioPanel([
            {value: '', html: 'View All'},
            {value: 'in-review', html: 'In Review'},
            {value: 'reviewed', html: 'Reviewed'},
            {value: 'corrected', html: 'Corrected'}
        ]);
        this.radioPanel.on('change', (selectedItem) => {
            this.emit('change', selectedItem);
        });
        this.selectedFilter = window.location.hash.replace('#', '');
        this.radioPanel.updateSelected(this.selectedFilter);
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.regionFrom('.filter').attach(this.radioPanel);
    }

}
