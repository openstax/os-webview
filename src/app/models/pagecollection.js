import BaseModel from '~/helpers/backbone/model';
import BaseCollection from '~/helpers/backbone/collection';
import {props} from '~/helpers/backbone/decorators';

let pageUrl = 'https://oscms-dev.openstax.org/api/v1/pages';

@props({
    url: pageUrl
})
class PageModel extends BaseModel {}

@props({
    url: pageUrl
})
class PageCollection extends BaseCollection {

    findMetaType(name) {
        return this.find((model) => model.get('meta').type === name);
    }

    whenLoaded(callback) {
        if (this.models.length < 2) {
            this.once('add', callback);
        } else {
            callback();
        }
    }

    withPage(pageName, callback) {
        let toDo = () =>
            this.findMetaType(pageName).fetch({success: callback});

        if (this.models.length === 0) {
            this.whenLoaded(toDo);
        } else {
            toDo();
        }
    }

}

let pageModel = new PageModel(),
    pageCollection = new PageCollection();

pageModel.fetch({
    success: () => {
        pageCollection.add(pageModel.attributes.pages);
    }
});

export default pageCollection;
