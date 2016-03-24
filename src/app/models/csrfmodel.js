import BaseModel from '~/helpers/backbone/model';
import settings from 'settings';

let pageUrl = `${settings.apiOrigin}/api/mail/send_mail/`;

export default class CsrfModel extends BaseModel {
    urlRoot = pageUrl;
}

let csrfModel = new CsrfModel();

export default csrfModel;
