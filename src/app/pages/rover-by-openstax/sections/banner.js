import sectionCreator, {insertHtmlMixin} from './section';
import {description as template} from './banner.html';
import css from './banner.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'banner',
        classes: ['orange']
    }
};

export default sectionCreator(spec, insertHtmlMixin);
