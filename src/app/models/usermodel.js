import BaseModel from '~/helpers/backbone/model';
import {ApiOrigin} from '/settings.js';

let url = `${ApiOrigin}/api/user/`;

class UserModel extends BaseModel {
    urlRoot = url;

    sync(method, model, options) {
        if (!options.crossDomain) {
            options.crossDomain = true;
        }
        if (!options.xhrFields) {
            options.xhrFields = {withCredentials: true};
        }
        return super.sync(method, model, options);
    }
}

let userModel = new UserModel();

export default userModel;
