import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import { utils } from 'superb.js';
import { on } from '~/helpers/controller/decorators';
import shell from '~/components/shell/shell';
import { description as template } from './separatemap.html';
import css from './separatemap.css';
import { shuffle } from '~/helpers/data';
import Map1 from '../impact-dev/map/map';
import mapboxgl from 'mapbox-gl';

export default class SeparateMap extends CMSPageController {

    init() {
        this.slug = 'pages/our-impact';
        this.template = template;
        this.css = css;
        this.regions = {
            map: '.mapd'
        };
        this.view = {
            classes: ['separatemap-page']
        };
        this.model = {
            loaded: ''
        };
    }

    onDataLoaded() {
        shell.regions.footer.el.setAttribute('hidden', '');
        const tokenn = 'pk.eyJ1Ijoib3BlbnN0YXgiLCJhIjoiY2pnbWtjajZzMDBkczJ6cW1kaDViYW02aCJ9.0w3LCa7lzozzRgXM7xvBfQ';
        const bounds = [[-90, 90], [-180, 180]];
        let mapCenter;

        if ($.isMobileDisplay()) {
            mapCenter = [-95.712891, 37.090240];
        } else {
            mapCenter = [0, 0];
        }
        mapboxgl.accessToken = tokenn;
        const mapOb = new mapboxgl.Map({
            container: 'mapd',
            style: 'mapbox://styles/openstax/cjhv1z4iq00of2smldg1o0ktw',
            center: mapCenter,
            zoom: 2
        });
        const mapObject = {
            mapObj: mapOb,
            pageType: 'separate'
        };

        mapOb.on('mouseenter', 'os-schools', () => {
            mapOb.getCanvas().style.cursor = 'pointer';
        });

        mapOb.on('mouseleave', 'os-schools', () => {
            mapOb.getCanvas().style.cursor = '';
        });

        this.regions.map.append(new Map1(mapObject));

        this.model.loaded = 'loaded';
        this.update();

        shell.hideLoader();
    }

    onClose() {
        shell.regions.footer.el.removeAttribute('hidden');
    }


}
