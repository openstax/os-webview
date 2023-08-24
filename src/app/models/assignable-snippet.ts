import cmsFetch from '~/helpers/cms-fetch';
import {camelCaseKeys} from '~/helpers/page-data-utils';

type Snippet = {
    assignableAvailableImage: string;
    assignableDescription: string;
};

export default cmsFetch('snippets/assignableavailable')
    .then((r) => r[0])
    .then(camelCaseKeys) as Promise<Snippet>;
