import cmsFetch from './cmsFetch';

export default cmsFetch('salesforce/schools/')
    .then((objList) => objList.map((obj) => obj.name));
