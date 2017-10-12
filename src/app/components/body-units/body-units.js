import {Controller} from 'superb';
import $ from '~/helpers/$';
import {render as alignedImageTemplate} from './aligned-image.html';
import Quote from '~/components/quotes/quote/quote';

const template = () => '';

class BodyUnit extends Controller {

    init(data) {
        this.data = data;
        this.template = template;
    }

}

class Paragraph extends BodyUnit {

    onLoaded() {
        this.el.innerHTML = this.data;
    }

}

class AlignedImage extends BodyUnit {

    init(data) {
        super.init(data);
        this.template = alignedImageTemplate;
        this.model = Object.assign({
            imageUrl: data.image
        }, data);
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
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
