import sectionCreator, {insertHtmlMixin} from './section';
import {description as template} from './getting-started.html';
import css from './getting-started.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'getting-started',
        classes: ['orange']
    }
};

export default sectionCreator(spec, insertHtmlMixin);
