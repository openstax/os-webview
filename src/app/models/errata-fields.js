import cmsFetch from '~/helpers/cms-fetch';

export default function getFields(field) {
    return cmsFetch(`errata-fields?field=${field}`);
}
