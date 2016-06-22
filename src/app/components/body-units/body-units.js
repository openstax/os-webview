import {Controller} from 'superb';
// import ImageModel from '~/models/imagemodel';
import Quote from '~/components/quotes/quote/quote';

class Paragraph extends Controller {

    init(data) {
        this.data = data;
    }

    onLoaded() {
        // FIX: Set in template, not in Controller
        this.el.innerHTML = this.data;
    }

}

class AlignedImage extends Controller {

    /*
    init(data) {
        // FIX: Lots of model stuff to fix
        this.viewPromise = new Promise((resolve) => {
            new ImageModel({id: data.image}).fetch().then((imageData) => {
                const view = new Quote({
                    quoteHtml: data.caption,
                    orientation: data.alignment,
                    imageUrl: imageData.file,
                    height: imageData.height
                });

                resolve(view);
            });
        });
    }
    */

    /*
    onLoaded() {
        this.viewPromise.then((view) => {
            this.el.appendChild(view.el);
            view.render();
        });
    }
    */

}

class PullQuote extends Controller {

    init(data) {
        this.data = data;
    }

    onLoaded() {
        // FIX: This isn't how to attach views (delete this view and just use Quote?)
        const view = new Quote({
            quoteHtml: this.data.quote,
            attribution: this.data.attribution
        });

        this.el.appendChild(view.el);
        view.render();
    }

}

class AlignedHtml extends Controller {

    init(data) {
        this.data = data;
    }

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

export default bodyUnits;
