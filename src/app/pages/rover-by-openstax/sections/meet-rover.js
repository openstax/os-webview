import sectionCreator from './section';
import {description as template} from './meet-rover.html';
import css from './meet-rover.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'meet-rover'
    }
};

export default sectionCreator(spec);
