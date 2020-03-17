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
        const thirdNodeFill = ['Corrected', 'Will correct'].includes(this.barStatus) ?
            ' filled' : ' filled-no';
        const bars = this.barStatus ? 2 : {
            'In Review': 0,
            'Reviewed': 1,
            'Will Correct': 1
        }[this.status];

        return {
            barStatus: this.barStatus,
            firstNodeClass: bars === 0 ? ' filled ' : '',
            secondNodeClass: bars === 1 ? ' filled' : '',
            thirdNodeClass: bars > 1 ? thirdNodeFill : ''
        };
    }
};

export default componentType(spec);
