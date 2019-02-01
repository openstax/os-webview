import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './hero-journey.html';
import css from './hero-journey.css';

const spec = {
    template,
    css,
    view: {
        classes: ['hero-journey', 'page'],
        tag: 'main' // if the HTML doesn't contain a main tag
    },
    slug: 'pages/hero-journey',
    model() {
        return {
            heading: this.heading
        };
    }
};

export default class extends componentType(spec) {

    onDataLoaded() {
        
    }

}
