import BaseModel from '~/helpers/backbone/model';

let url = '//oscms-dev.openstax.org/api/user/';

export default class UserModel extends BaseModel {
    urlRoot = url;
}
