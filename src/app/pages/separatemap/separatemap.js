import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import { on } from '~/helpers/controller/decorators';
import shell from '~/components/shell/shell';
import { description as template } from './separatemap.html';
import Map1 from '../impact-dev/map/map';
import mapboxgl from 'mapbox-gl';
import css from './separatemap.css';

export default class SeparateMap extends CMSPageController {

    init() {
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
        shell.showLoader();
    }

    onAttached() {
        shell.regions.footer.el.setAttribute('hidden', '');
        this.el.querySelector('.close-map-msg').setAttribute('hidden', '');
        const tokenn = 'pk.eyJ1Ijoib3BlbnN0YXgiLCJhIjoiY2pnbWtjajZzMDBkczJ6cW1kaDViYW02aCJ9.0w3LCa7lzozzRgXM7xvBfQ';
        const bounds = [[-180, -85], [180, 85]];
        let mapZoom;

        if ($.isMobileDisplay()) {
            mapZoom = 2;
        } else {
            mapZoom = 3;
        }
        mapboxgl.accessToken = tokenn;
        const mapOb = new mapboxgl.Map({
            container: 'mapd',
            style: 'mapbox://styles/openstax/cjhv1z4iq00of2smldg1o0ktw',
            center: [-95.712891, 37.090240],
            maxBounds: bounds,
            zoom: mapZoom
        });

        mapOb.on('load', () => {
            if (mapOb.loaded()) {
                mapOb.resize();
                this.model.loaded = 'loaded';
                this.update();
                shell.hideLoader();
            }
        });

        mapOb.on('mouseenter', 'os-schools', () => {
            mapOb.getCanvas().style.cursor = 'pointer';
        });

        mapOb.on('mouseleave', 'os-schools', () => {
            mapOb.getCanvas().style.cursor = '';
        });

        const mapObject = {
            mapObj: mapOb,
            pageType: 'separate'
        };

        this.regions.map.append(new Map1(mapObject));
    }

    @on('click .popup-msg-cross-icon')
    popupClose() {
        if (!$.isMobileDisplay()) {
            this.el.querySelector('.popup-msg-div').setAttribute('hidden', '');
        }
    }

    @on('mouseover .back-impact-div')
    mapClose() {
        if (!$.isMobileDisplay()) {
            this.el.querySelector('.close-map-msg').removeAttribute('hidden');
        }
    }

    @on('mouseout .back-impact-div')
    mapCloseOut() {
        if (!$.isMobileDisplay()) {
            this.el.querySelector('.close-map-msg').setAttribute('hidden', '');
        }
    }

    onClose() {
        shell.regions.footer.el.removeAttribute('hidden');
    }


}
