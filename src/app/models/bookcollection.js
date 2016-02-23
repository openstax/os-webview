import BaseModel from '~/helpers/backbone/model';
import BaseCollection from '~/helpers/backbone/collection';
import {props} from '~/helpers/backbone/decorators';

let url = 'https://oscms-dev.openstax.org/api/v1/pages/?type=books.Book&fields=title,subject_name,is_ap,cover_url';

@props({
    url
})
class CatalogModel extends BaseModel {}


@props({
    url
})
class BookCollection extends BaseCollection {}

let catalogModel = new CatalogModel(),
    bookCollection = new BookCollection();

catalogModel.fetch({
    success: () => {
        bookCollection.add(catalogModel.attributes.pages);
    }
});

export default bookCollection;
