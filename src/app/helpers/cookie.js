export default {
    get hash() {
        return decodeURIComponent(document.cookie)
            .split('; ')
            .reduce((a, b) => {
                const [key, val] = b.split('=');

                a[key] = val;
                return a;
            }, {});
    },
    setKey(key) {
        document.cookie = `${key}=true;path=/;expires=Tue, 19 Jan 2038 03:14:07 GMT`;
    },
    deleteKey(key) {
        document.cookie = `${key}=true;path=/;expires=Thu, 1 Jan 1970 03:14:07 GMT`;
    }
};
