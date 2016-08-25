import settings from 'settings';

const userUrl = `${settings.apiOrigin}/api/user`;
const sfUserUrl = `${settings.apiOrigin}/api/user_salesforce`;

class UserModel {

    constructor(url) {
        this.fetch();
        this.url = url;
    }

    fetch() {
        this.promise = new Promise((resolve) => {
            fetch(`${this.url}`)
            .then((response) => response.json())
            .then(resolve);
        });
        return this.promise;
    }

}

export const sfUserModel = new UserModel(sfUserUrl);
const userModel = new UserModel(userUrl);

export default userModel;
