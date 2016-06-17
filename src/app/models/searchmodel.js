import BaseModel from '~/helpers/backbone/model';
import settings from 'settings';

let searchUrl = `${settings.apiOrigin}/api/search`;

export default class SearchModel extends BaseModel {
    urlRoot = searchUrl;
}
