import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './persona.html';
import css from './persona.css';

const spec = {
    template,
    css,
    view: {
        classes: ['persona']
    },
    model() {
        return {
            headline: this.title,
            description: this.description,
            imageUrl: this.imageUrl,
            imageAlt: '',
            partners: this.partners,
            filler: (new Array(4 - (this.partners.length % 4))).fill('')
        };
    }
};

export default componentType(spec);
