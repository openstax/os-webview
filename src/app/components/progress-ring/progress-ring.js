import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './progress-ring.html';
import css from './progress-ring.css';

const spec = {
    template,
    css,
    // For specifying the tag (default div) and classes of the container element
    view: {
        classes: ['progress-ring']
    },
    model() {
        const normalizedRadius = this.radius - this.stroke * 2;
        const circumference = normalizedRadius * 2 * Math.PI;

        return {
            circumference,
            message: this.message,
            normalizedRadius,
            radius: this.radius,
            rotation: -90,
            strokeWidth: this.stroke,
            strokeDashoffset: circumference - this.progress / 100 * circumference
        };
    }
};

export default class extends componentType(spec, busMixin) {

    whenPropsUpdated() {
        this.update();
    }

}
