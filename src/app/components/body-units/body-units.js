import componentType from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import {description as alignedImageTemplate} from './aligned-image.html';
import Quote from '~/components/quote/quote';

function bodyUnitMixin(superclass) {
    return class extends superclass {

        init(data) {
            super.init();
            this.data = data;
        }

    };
}

const BodyUnit = componentType({}, bodyUnitMixin);

class Paragraph extends BodyUnit {

    onLoaded() {
        this.el.innerHTML = this.data;
    }

}

class AlignedImage extends BodyUnit {

    init(data) {
        super.init(data);
        this.template = alignedImageTemplate;
        const selectedImage = data.image.original;

        this.model = {
            imageUrl: selectedImage.src,
            imageAlt: selectedImage.alt,
            caption: data.caption,
            alignmentClass: ['left', 'right'].includes(data.alignment) ? data.alignment : ''
        };
    }

    onLoaded() {
        this.insertHtml();
    }

}

class PullQuote extends Quote {

    init(data) {
        super.init({
            image: {},
            content: data.quote,
            attribution: data.attribution
        });
    }

}

// Using CMS tags, which are not camel-case
/* eslint camelcase: 0 */
const bodyUnits = {
    paragraph: Paragraph,
    aligned_image: AlignedImage,
    pullquote: PullQuote
};

const bodyUnitView = (bodyUnitData) => {
    let unitType = bodyUnitData.type;

    if (!(unitType in bodyUnits)) {
        console.warn('Unknown type:', bodyUnitData, '(using paragraph)');
        unitType = 'paragraph';
    }
    const View = bodyUnits[unitType];

    return new View(bodyUnitData.value);
};

export default bodyUnitView;
