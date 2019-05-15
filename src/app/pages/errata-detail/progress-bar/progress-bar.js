import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './progress-bar.html';
import css from './progress-bar.css';

const spec = {
    template,
    css,
    view: {
        classes: ['progress-bar-container', 'body-block']
    },
    // eslint-disable-next-line complexity
    model() {
        const thirdNodeFill = this.barStatus === 'Corrected' ? ' filled' : ' filled-no';
        const bars = this.bars;

        return {
            barStatus: this.barStatus,
            showDatesInBar: this.barStatus === '' || this.reviewedDate,
            firstNodeClass: bars === 0 ? ' filled ' : '',
            secondNodeClass: bars === 1 ? ' filled' : '',
            thirdNodeClass: bars > 1 ? thirdNodeFill : '',
            createdDate: this.createdDate,
            reviewedDate: this.reviewedDate,
            correctedDate: this.correctedDate
        };
    }
};

export default class extends componentType(spec) {

    init(props) {
        super.init();
        Object.assign(this, props);
        this.bars = this.barStatus ? 2 : {
            'In Review': 0,
            'Reviewed': 1,
            'Will Correct': 1
        }[this.status];
    }

}
