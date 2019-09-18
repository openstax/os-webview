import cmsFetch from './cmsFetch';

export default function getFields(field) {
    return cmsFetch(`errata-fields?field=${field}`);
}
