import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import { description as template } from './impact-dev.html';
import Map1 from './map/map';
import State from './statistics/stat';
import Studentinfo from './studentinfo/studentinfo';
import Schoolmap from './schoolmap/schoolmap';
import mapboxgl from 'mapbox-gl';
import css from './impact-dev.css';

const spec = {
    template,
    css,
    view: {
        classes: ['home-page']
    },
    regions: {
        map: '.mapdiv',
        stat: '.statdiv',
        studentinfo: '.studentinfodiv',
        schoolmap: '.schoolmapdiv'
    },
    model: {
        loaded: ''
    }
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class ImpactDev extends BaseClass {

    onAttached() {
        const tokenn = 'pk.eyJ1Ijoib3BlbnN0YXgiLCJhIjoiY2pnbWtjajZzMDBkczJ6cW1kaDViYW02aCJ9.0w3LCa7lzozzRgXM7xvBfQ';
        let mapCenter;

        if ($.isMobileDisplay()) {
            mapCenter = [-95.712891, 37.090240];
        } else {
            mapCenter = [0, 0];
        }
        mapboxgl.accessToken = tokenn;
        const map = new mapboxgl.Map({
            container: 'mapdiv',
            style: 'mapbox://styles/openstax/cjhv1z4iq00of2smldg1o0ktw',
            center: mapCenter,
            zoom: 2
        });

        map.scrollZoom.disable();
        map.dragPan.disable();
        map.doubleClickZoom.disable();
        map.on('load', () => {
            if (map.loaded()) {
                map.resize();
                this.model.loaded = 'loaded';
                this.update();
                this.hideLoader();
            }
        });

        const mapObject = {
            mapObj: map,
            pageType: 'landing'
        };

        this.regions.map.append(new Map1(mapObject));
        this.regions.stat.attach(new State());
        this.regions.studentinfo.attach(new Studentinfo());
        this.regions.schoolmap.attach(new Schoolmap());
    }

}
