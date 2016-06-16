import BaseModel from '~/helpers/backbone/model';
import settings from 'settings';

let imageUrl = `${settings.apiOrigin}/api/v0/images`;

export default class ImageModel extends BaseModel {
    urlRoot = imageUrl;
}
