import BaseModel from '~/helpers/backbone/model';
import settings from 'settings';

const normalUrl = `${settings.apiOrigin}/api/user/`;
const sfUrl = `${settings.apiOrigin}/api/user_salesforce`;

class UserModel extends BaseModel {

    constructor(url) {
        super(url);
        this.urlRoot = url;
    }

    sync(method, model, options) {
        if (!options.crossDomain) {
            options.crossDomain = true;
        }
        if (!options.xhrFields) {
            options.xhrFields = {};
        }
        options.xhrFields.withCredentials = true;
        return super.sync(method, model, options);
    }
}

let userModel = new UserModel(normalUrl);

export default userModel;
export let sfModel = new UserModel(sfUrl);
