import BaseModel from '~/helpers/backbone/model';
import {ApiOrigin} from '~/../settings.js';

let pageUrl = `${ApiOrigin}/api/v1/pages`;

export default class PageModel extends BaseModel {
    urlRoot = pageUrl;
}
