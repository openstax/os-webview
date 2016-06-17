import BaseView from '~/helpers/backbone/view';
import ImageModel from '~/models/imagemodel';
import Quote from '~/components/quote/quote';
import {props} from '~/helpers/backbone/decorators';

@props({template: ''})
class Paragraph extends BaseView {
    constructor(data) {
        super();
        this.data = data;
    }
    onRender() {
        this.el.innerHTML = this.data;
    }
}

@props({template: ''})
class AlignedImage extends BaseView {
    constructor(data) {
        super();
        this.viewPromise = new Promise((resolve) => {
            new ImageModel({id: data.image}).fetch().then((imageData) => {
                let view = new Quote({
                    quoteHtml: data.caption,
                    orientation: data.alignment,
                    imageUrl: imageData.file,
                    height: imageData.height
                });

                resolve(view);
            });
        });
    }
    onRender() {
        this.viewPromise.then((view) => {
            this.el.appendChild(view.el);
            view.render();
        });
    }
}

@props({template: ''})
class PullQuote extends BaseView {
    constructor(data) {
        super();
        this.data = data;
    }
    onRender() {
        let view = new Quote({
            quoteHtml: this.data.quote,
            attribution: this.data.attribution
        });

        this.el.appendChild(view.el);
        view.render();
    }
}

@props({template: ''})
class AlignedHtml extends BaseView {
    constructor(data) {
        super();
        this.data = data;
    }
    onRender() {
        this.el.innerHTML = this.data.html;
        this.el.style.display = 'flex';
        let children = this.el.childNodes.length;

        if (this.data.alignment === 'full') {
            this.el.style.justifyContent = children === 1 ? 'center' : 'space-between';
        } else if (this.data.alignment === 'left') {
            this.el.style.justifyContent = 'flex-start';
        } else {
            this.el.style.justifyContent = 'flex-end';
        }
    }
}

// Using CMS tags, which are not camel-case
/* eslint camelcase: 0 */
let bodyUnits = {
    paragraph: Paragraph,
    aligned_image: AlignedImage,
    pullquote: PullQuote,
    aligned_html: AlignedHtml
};

export default bodyUnits;
