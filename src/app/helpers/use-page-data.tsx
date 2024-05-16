import React from 'react';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import type {LocaleEntry} from '~/components/language-selector/language-selector';

type Data = {
    translations: [Array<LocaleEntry>];
    error?: string;
    image: number | object;
    [key: string | symbol]: Data | string | undefined | number | object;
};

// eslint-disable-next-line complexity
async function replaceImageNumbersWithImageData(data: Data) {
    if (typeof data.image === 'number') {
        const json = await fetchFromCMS(`images/${data.image}`);

        data.image = json.file || (json.meta || {}).download_url;
    }

    for (const prop of Reflect.ownKeys(data)) {
        if (typeof data[prop] === 'object' && data[prop] !== null) {
            await replaceImageNumbersWithImageData(data[prop] as Data);
        }
    }
}

async function fetchDataAndExpandImages(
    slug: string,
    preserveWrapping: boolean
): Promise<Data> {
    const data = await fetchFromCMS(slug, preserveWrapping);

    await replaceImageNumbersWithImageData(data);

    return data;
}

export function fetchPageData(
    slug: string,
    preserveWrapping: boolean,
    noCamelCase: boolean
): Promise<Data> {
    const camelCaseOrNot = noCamelCase ? (obj: object) => obj : camelCaseKeys;

    return fetchDataAndExpandImages(slug, preserveWrapping).then(
        camelCaseOrNot
    );
}

export default function usePageData(
    slug: string,
    preserveWrapping = false,
    noCamelCase = false
) {
    const [data, setData] = React.useState<Data>();

    React.useEffect(() => {
        fetchPageData(slug, preserveWrapping, noCamelCase).then(setData);
    }, [slug, preserveWrapping, noCamelCase]);

    return data;
}
