import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import { description as template } from './impact-dev.html';
import Map1 from './map/map';
import State from './statistics/stat';
import Studentinfo from './studentinfo/studentinfo';
import Schoolmap from './schoolmap/schoolmap';
import mapboxgl from 'mapbox-gl';
import css from './impact-dev.css';

export default class ImpactDev extends CMSPageController {

    static description = 'Since 2012, OpenStax has saved students millions ' +
    'through free, peer-reviewed college textbooks. Learn more about our ' +
    'impact on the 3,000+ schools who use our books.';
    init() {
        this.template = template;
        this.css = css;
        this.regions = {
            map: '.mapdiv',
            stat: '.statdiv',
            studentinfo: '.studentinfodiv',
            schoolmap: '.schoolmapdiv'
        };
        this.view = {
            classes: ['home-page']
        };

        this.model = {
            loaded: ''
        };
        shell.showLoader();
    }

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
                shell.hideLoader();
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
