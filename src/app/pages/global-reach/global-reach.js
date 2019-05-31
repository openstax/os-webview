import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import { description as template } from './global-reach.html';
import Map1 from './map/map';
import State from './statistics/stat';
import Studentinfo from './studentinfo/studentinfo';
import Schoolmap from './schoolmap/schoolmap';
import mapboxgl from 'mapbox-gl';
import css from './global-reach.css';
import settings from 'settings';

const spec = {
    template,
    css,
    view: {
        classes: ['map-page']
    },
    regions: {
        map: '.mapdiv',
        stat: '.statdiv',
        studentinfo: '.studentinfodiv',
        schoolmap: '.schoolmapdiv'
    },
    model: {
        loaded: ''
    },
    slug: 'pages/global-reach'
};
const BaseClass = componentType(spec, canonicalLinkMixin, loaderMixin);

export default class ImpactDev extends BaseClass {

    createMap(model) {
        const tokenn = settings.mapboxPK;
        const mapCenter = $.isMobileDisplay() ? [-95.712891, 37.090240] : [0, 0];

        mapboxgl.accessToken = tokenn;
        const map = new mapboxgl.Map({
            container: 'mapdiv',
            style: settings.mapboxStyle,
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
            model
        };

        return new Map1(mapObject);
    }

    onDataLoaded() {
        const data = this.pageData;
        const map = this.createMap({
            pageType: 'landing',
            heading: data.title,
            buttonText: data.header_text
        });

        this.regions.map.append(map);
        this.regions.stat.attach(new State({
            model: data.section_1_cards.map((obj) => (
                {
                    imageUrl: obj.image.image,
                    uText1: obj.number,
                    uText2: obj.unit,
                    lowerText: obj.description
                }
            ))
        }));
        this.regions.studentinfo.attach(new Studentinfo({
            model: {
                header1: data.section_2_header_1,
                description1: data.section_2_blurb_1,
                linkUrl1: data.section_2_link_1,
                linkText1: data.section_2_cta_1,
                image1: data.section_2_image_1_url,
                header2: data.section_2_header_2,
                description2: data.section_2_blurb_2,
                linkUrl2: data.section_2_link_2,
                linkText2: data.section_2_cta_2,
                image2: data.section_2_image_2_url
            }
        }));
        this.regions.schoolmap.attach(new Schoolmap({
            model: {
                heading: data.section_3_heading,
                description: data.section_3_blurb,
                linkText: data.section_3_cta,
                linkUrl: data.section_3_link
            }
        }));
    }

}
