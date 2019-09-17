import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './recommended-callout.html';
import css from './recommended-callout.css';

const spec = {
    template,
    css,
    view: {
        classes: ['recommended-callout']
    },
    model() {
        return {
            calloutTitle: this.calloutTitle || 'Recommended',
            calloutBlurb: this.calloutBlurb
        };
    }
};

class RecommendedCallout extends componentType(spec, busMixin, insertHtmlMixin) {

    @on('click .put-away')
    hideForever() {
        this.emit('hide-forever');
        this.detach();
    }

};

export default function (regionEl, title, blurb) {
    if (!regionEl) {
        return null;
    }

    return new RecommendedCallout({
        el: regionEl,
        calloutTitle: title,
        calloutBlurb: blurb
    });
}
