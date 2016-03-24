import BaseModel from '~/helpers/backbone/model';
import settings from 'settings';

let pageUrl = `${settings.apiOrigin}/api/v1/pages`;

export default class PageModel extends BaseModel {
    urlRoot = pageUrl;
}
