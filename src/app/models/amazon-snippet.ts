import cmsFetch from '~/helpers/cms-fetch';
import {camelCaseKeys} from '~/helpers/page-data-utils';

export default cmsFetch('snippets/amazonbookblurb')
    .then((r) => r[0])
    .then(camelCaseKeys)
    .then((r) => r?.amazonBookBlurb ?? '** no Amazon blurb snippet**') as Promise<string>;
