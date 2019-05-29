import sectionCreator from './section';
import {description as template} from './stepwise.html';
import css from './stepwise.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'stepwise',
        classes: ['near-white']
    }
};

export default sectionCreator(spec);
