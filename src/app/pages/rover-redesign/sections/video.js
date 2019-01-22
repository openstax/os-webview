import sectionCreator, {insertHtmlMixin} from './section';
import {description as template} from './video.html';
import css from './video.css';

const spec = {
    template,
    css,
    view: {
        tag: 'section',
        id: 'video',
        classes: ['charcoal']
    }
};

export default sectionCreator(spec, insertHtmlMixin);
