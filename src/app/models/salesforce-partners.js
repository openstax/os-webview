import cmsFetch from './cmsFetch';
import $ from '~/helpers/$';

export default cmsFetch('salesforce/partners')
    .then((entries) => entries.map((entry) => Object.assign({
        // eslint-disable-next-line camelcase
        verified_features: $.isTestingEnvironment() ? '[Set to true for testing]' : false
    }, entry)));
