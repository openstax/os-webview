import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './numbered-navigator.html';
import css from './numbered-navigator.css';

const nodeStatuses = ['future', 'on', 'done'];
const spec = {
    template,
    view: {
        classes: ['numbered-navigator']
    },
    css,
    model() {
        const result = this.getProps();

        result.nodeStatus = (nodeIndex) => {
            return nodeStatuses[1 + Math.sign(result.lastCompleted - nodeIndex)];
        };
        return result;
    }
};

export default class extends componentType(spec) {
}
