import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import Map from './map/map';
import State from './statistics/stat';
import Studentinfo from './studentinfo/studentinfo';
import Schoolmap from './schoolmap/schoolmap';

const spec = {
    view: {
        classes: ['global-reach', 'page'],
        tag: 'main'
    },
    model: {
        loaded: ''
    },
    slug: 'pages/global-reach'
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class ImpactDev extends BaseClass {

    onDataLoaded() {
        const data = this.pageData;

        this.regions.self.attach(new Map({
            model: {
                pageType: 'landing',
                heading: data.title,
                buttonText: data.header_text,
                imageUrl: data.map_image_url
            }
        }));
        this.regions.self.append(new State({
            model: data.section_1_cards.map((obj) => (
                {
                    imageUrl: obj.image.image,
                    uText1: obj.number,
                    uText2: obj.unit,
                    lowerText: obj.description
                }
            ))
        }));
        /*
         * This section has two subjections, each with a header, description,
         * image, and link.
         */
        this.regions.self.append(new Studentinfo({
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
        this.regions.self.append(new Schoolmap({
            model: {
                heading: data.section_3_heading,
                description: data.section_3_blurb,
                linkText: data.section_3_cta,
                linkUrl: data.section_3_link
            }
        }));
    }

}
