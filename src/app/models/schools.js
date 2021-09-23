import cmsFetch from './cmsFetch';

export default cmsFetch('salesforce/schools/')
    .then((objList) => objList.map((obj) => ({
        name: obj.name,
        type: obj.type,
        location: obj.location,
        'total_school_enrollment': obj.total_school_enrollment
    })));
