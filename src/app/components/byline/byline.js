import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './byline.html';
import css from './byline.css';
import {formatDateForBlog} from '~/helpers/data';

const spec = {
    template,
    css,
    view: {
        classes: ['byline']
    },
    model() {
        return {
            date: formatDateForBlog(this.date),
            author: this.author,
            source: this.source
        };
    }
};

export default componentType(spec);
