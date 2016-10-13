import {Controller} from 'superb';
// import ImageModel from '~/models/imagemodel';
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
        // FIX: Set in template, not in Controller
        this.el.innerHTML = this.data;
    }

}

class AlignedImage extends BodyUnit {

    onLoaded() {

    }

}

class PullQuote extends BodyUnit {

    onLoaded() {
        // FIX: This isn't how to attach views (delete this view and just use Quote?)
        const view = new Quote({
            quoteHtml: this.data.quote,
            attribution: this.data.attribution
        });

        this.el.appendChild(view.el);
        this.update();
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
    const unitType = bodyUnitData.type || 'paragraph';
    const View = bodyUnits[unitType];

    return new View(bodyUnitData.value || bodyUnitData);
};

export default bodyUnitView;
