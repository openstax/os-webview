import React from 'react';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';

// eslint-disable-next-line complexity
async function replaceImageNumbersWithImageData(data) {
    if (typeof data.image === 'number') {
        const json = await fetchFromCMS(`images/${data.image}`);

        data.image = json.file || (json.meta || {}).download_url;
    }

    for (const prop of Reflect.ownKeys(data)) {
        if (typeof data[prop] === 'object' && data[prop] !== null) {
            await replaceImageNumbersWithImageData(data[prop]);
        }
    }
}

async function fetchDataAndExpandImages(slug, preserveWrapping) {
    const data = await fetchFromCMS(slug, preserveWrapping);

    await replaceImageNumbersWithImageData(data);

    return data;
}

export function fetchPageData(slug, preserveWrapping=false, noCamelCase=false) {
    const camelCaseOrNot = noCamelCase ? (obj) => obj : camelCaseKeys;

    return fetchDataAndExpandImages(slug, preserveWrapping)
        .then(camelCaseOrNot);
}

export default function usePageData(slug, preserveWrapping, noCamelCase) {
    const [data, setData] = React.useState();

    React.useEffect(() =>
        fetchPageData(slug, preserveWrapping, noCamelCase)
            .then(setData),
    [slug, preserveWrapping, noCamelCase]);

    return data;
}
