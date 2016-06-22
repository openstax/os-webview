import LoadingView from '~/controllers/loading-view';
// import PageModel from '~/models/pagemodel';
// import ImageModel from '~/models/imagemodel';
// import router from '~/router';

/*
const toHtmlBlock = (spec) => {
    switch (spec.type) {
    case 'heading':
        return `<h1>${spec.value}</h1>`;
    case 'image':
        return new Promise((resolve) => {
            new ImageModel({id: spec.value}).fetch().then((imageData) => {
                resolve(`<img src="${imageData.file}">`);
            });
        });
    default:
        return spec.value;
    }
};
*/

export default class CmsPage extends LoadingView {

    // init(id) {
    init() {
        this.template = ''; // FIX: This probably needs a real template
        this.view = {
            classes: ['boxed']
        };

        // Fix: Move this to a model/router
        /*
        this.blockDataPromise = new Promise((resolve) => {
            new PageModel({id}).fetch().then(
                (data) => {
                    const promises = data.body.map((spec) => toHtmlBlock(spec, promises));

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
        */
    }

    /*
    onLoaded() {
        // FIX: This should be part of the template
        this.blockDataPromise.then((blocks) => {
            this.el.innerHTML = blocks.join('\n');
        });
    }
    */

}
