import BaseModel from '~/helpers/backbone/model';

let pageUrl = '//oscms-dev.openstax.org/api/v1/pages';

export default class PageModel extends BaseModel {
    urlRoot = pageUrl;
}
