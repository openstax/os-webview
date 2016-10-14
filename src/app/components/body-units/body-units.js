import {Controller} from 'superb';
import $ from '~/helpers/$';
import {description as alignedImageTemplate} from './aligned-image.html';
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

class AlignedHtml extends BodyUnit {

    /*
    onLoaded() {
        // FIX: Do not set innerHTML or styles in Controller, move to template
        this.el.innerHTML = this.data.html;
        this.el.style.display = 'flex';
        const children = this.el.childNodes.length;

        if (this.data.alignment === 'full') {
            this.el.style.justifyContent = children === 1 ? 'center' : 'space-between';
        } else if (this.data.alignment === 'left') {
            this.el.style.justifyContent = 'flex-start';
        } else {
            this.el.style.justifyContent = 'flex-end';
        }
    }
    */

}

// Using CMS tags, which are not camel-case
/* eslint camelcase: 0 */
const bodyUnits = {
    paragraph: Paragraph,
    aligned_image: AlignedImage,
    pullquote: PullQuote,
    aligned_html: AlignedHtml
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
