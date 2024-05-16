import cmsFetch from '~/helpers/cms-fetch';

export default function getFields(field: string) {
    return cmsFetch(`errata-fields?field=${field}`);
}
