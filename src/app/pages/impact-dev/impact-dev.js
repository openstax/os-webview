import VERSION from '~/version';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import { utils } from 'superb.js';
import { on } from '~/helpers/controller/decorators';
import shell from '~/components/shell/shell';
import { description as template } from './impact-dev.html';
import { shuffle } from '~/helpers/data';
import Map1 from './map/map';
import State from './statistics/stat';
import Studentinfo from './studentinfo/studentinfo';
import Schoolmap from './schoolmap/schoolmap';
import mapboxgl from 'mapbox-gl';


export default class ImpactDev extends CMSPageController {

    static description = 'Since 2012, OpenStax has saved students millions ' +
    'through free, peer-reviewed college textbooks. Learn more about our ' +
    'impact on the 3,000+ schools who use our books.';
    init() {
        this.slug = 'pages/our-impact';
        this.template = template;
        this.css = `/app/pages/impact-dev/impact-dev.css?${VERSION}`;
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
    }

    onDataLoaded() {
        const tokenn = 'pk.eyJ1Ijoib3BlbnN0YXgiLCJhIjoiY2pnbWtjajZzMDBkczJ6cW1kaDViYW02aCJ9.0w3LCa7lzozzRgXM7xvBfQ';

        mapboxgl.accessToken = tokenn;
        const mapObject = new mapboxgl.Map({
            container: 'mapdiv',
            style: 'mapbox://styles/openstax/cjhv1z4iq00of2smldg1o0ktw',
            center: [-74.50, 40],
            zoom: 9
        });

        this.regions.map.append(new Map1(mapObject));
        this.regions.stat.attach(new State());
        this.regions.studentinfo.attach(new Studentinfo());
        this.regions.schoolmap.attach(new Schoolmap());

        this.model.loaded = 'loaded';
        this.update();

        shell.hideLoader();
    }

}
