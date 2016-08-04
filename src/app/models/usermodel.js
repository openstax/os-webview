import settings from 'settings';

const userPageUrl = `${settings.apiOrigin}/api/user`;

class UserModel {

    constructor() {
        this.fetch();
    }

    fetch() {
        this.promise = new Promise((resolve) => {
            fetch(`${userPageUrl}`)
            .then((response) => response.json())
            .then((json) => {
                resolve(json[0]);
            });
        });
        return this.promise;
    }

}

const userModel = new UserModel();

export default userModel;
