import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './study-edge.html';
import css from './study-edge.css';

const spec = {
    template,
    css,
    view: {
        classes: ['going-to-study-edge']
    },
    model() {
        return {
            googleBadge: '/images/study-edge/google-store-badge.png',
            googleLink: `https://openstax.studyedge.com/mobile-redirect/android?book=${this.bookShortName}`,
            appleBadge: '/images/study-edge/apple-store-badge.svg',
            appleLink: `https://openstax.studyedge.com/mobile-redirect/ios?book=${this.bookShortName}`
        };
    }
};

export default componentType(spec);
