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

export default function usePageData(slug, preserveWrapping=false, noCamelCase=false) {
    const [data, setData] = React.useState();

    React.useEffect(() => {
        const camelCaseOrNot = noCamelCase ? (obj) => obj : camelCaseKeys;

        fetchDataAndExpandImages(slug, preserveWrapping)
            .then(camelCaseOrNot)
            .then(setData);
    }, [slug, preserveWrapping, noCamelCase]);

    return data;
}
