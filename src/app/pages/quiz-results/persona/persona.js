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
            imageUrl: '//via.placeholder.com/600x480',
            imageAlt: '',
            logos: this.logos
        };
    }
};

export default componentType(spec);
