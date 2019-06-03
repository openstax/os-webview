import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './map.html';
import css from './map.css';
import Map from '~/helpers/map-api';
import $ from '~/helpers/$';

const spec = {
    template,
    css,
    view: {
        classes: ['mapbox']
    }
};

export default class extends componentType(spec) {

    onAttached() {
        const mapCenter = $.isMobileDisplay() ? [-95.712891, 37.090240] : [0, 0];

        this.map = new Map({
            container: 'mapdiv',
            center: mapCenter,
            zoom: 2,
            interactive: false
        });
    }

}
