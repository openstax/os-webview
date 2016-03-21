import BaseModel from '~/helpers/backbone/model';

let url = 'https://oscms-dev.openstax.org/api/user/';

class UserModel extends BaseModel {
    urlRoot = url;
}

let userModel = new UserModel();

export default userModel;
