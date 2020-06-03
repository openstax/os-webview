import $ from '~/helpers/$';
import memoize from 'lodash/memoize';

export function urlFromSlug(initialSlug) {
    const slug = initialSlug === 'news' ? 'pages/openstax-news' : initialSlug;
    const possibleSlash = slug.endsWith('/') ? '' : '/';
    const apiPrefix = slug.includes('pages') ? $.apiOriginAndPrefix :
        $.apiOriginAndOldPrefix;

    return `${apiPrefix}/${slug}${possibleSlash}`;
}

export default async function cmsFetch(path) {
    const url = path.replace(/[^?]+/, urlFromSlug);

    return await (await fetch(url)).json();
}

/**
 * For CMS data that will not change within a session
 */
export const fetchOnce = memoize(cmsFetch);
