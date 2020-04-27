import {Bus} from '~/helpers/controller/bus-mixin';
import CalloutJsx from './recommended-callout.jsx';
import WrappedJsx from '~/controllers/jsx-wrapper';
import {on} from '~/helpers/controller/decorators';
import css from './recommended-callout.css';

const parentClass = 'recommended-callout';

export default function (regionEl, title, blurb) {
    if (!regionEl) {
        return null;
    }
    const bus = new Bus();
    const child = new WrappedJsx(CalloutJsx, {
        title,
        blurb,
        onPutAway(event) {
            if (event) {
                bus.emit('hide-forever');
                child.detach();
                regionEl.classList.remove(parentClass);
            }
        }
    }, regionEl);

    regionEl.classList.add(parentClass);
    return bus;
}
