import LoadingView from '~/helpers/backbone/loading-view';
import PageModel from '~/models/pagemodel';
import ImageModel from '~/models/imagemodel';
import {props} from '~/helpers/backbone/decorators';
import router from '~/router';

let toHtmlBlock = (spec) => {
    switch (spec.type) {
    case 'heading':
        return `<h1>${spec.value}</h1>`;
    case 'image':
        return new Promise((resolve) => {
            new ImageModel({id: spec.value}).fetch().then((imageData) => {
                resolve(`<img src="${imageData.file}" />`);
            });
        });
    default: return spec.value;
    }
};

@props({
    template: ''
})
export default class CmsPage extends LoadingView {
    constructor(id) {
        super();
        this.blockDataPromise = new Promise((resolve) => {
            new PageModel({id}).fetch().then(
                (data) => {
                    let promises = data.body.map((spec) => toHtmlBlock(spec, promises));

                    Promise.all(promises).then((htmlBlocks) => {
                        resolve(htmlBlocks);
                    });
                },
                () => {
                    router.navigate('404', true);
                }
            );
        });

        this.otherPromises.push(this.blockDataPromise);
    }

    onRender() {
        super.onRender();
        this.blockDataPromise.then((blocks) => {
            this.el.innerHTML = blocks.join('\n');
        });
        this.el.classList.add('boxed');
    }
}
