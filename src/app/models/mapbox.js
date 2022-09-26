import cmsFetch from '~/helpers/cms-fetch';

export default cmsFetch('mapbox').then((r) => r[0]);
