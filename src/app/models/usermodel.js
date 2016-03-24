import BaseModel from '~/helpers/backbone/model';
import settings from 'settings';

let url = `${settings.apiOrigin}/api/user/`;

class UserModel extends BaseModel {
    urlRoot = url;

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

let userModel = new UserModel();

export default userModel;
