import $ from '~/helpers/$';
import memoize from 'lodash/memoize';

export function urlFromSlug(initialSlug) {
    const slug = initialSlug === 'news' ? 'pages/openstax-news' : initialSlug;
    const possibleSlash = (slug.endsWith('/') || slug.includes('?')) ? '' : '/';
    const apiPrefix = slug.includes('pages') ? $.apiOriginAndPrefix :
        $.apiOriginAndOldPrefix;

    return `${apiPrefix}/${slug}${possibleSlash}`;
}

export default async function cmsFetch(path) {
    const url = path.replace(/[^?]+/, urlFromSlug);

    return await (await fetch(url)).json();
}

export async function cmsPost(path, payload) {
    const url = path.replace(/[^?]+/, urlFromSlug);

    return await (await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })).json();
}

/**
 * For CMS data that will not change within a session
 */
export const fetchOnce = memoize(cmsFetch);
