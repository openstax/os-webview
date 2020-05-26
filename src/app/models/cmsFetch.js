import settings from 'settings';
import memoize from 'lodash/memoize';

export function urlFromSlug(initialSlug) {
    const slug = initialSlug === 'news' ? 'pages/openstax-news' : initialSlug;
    const possibleSlash = slug.endsWith('/') ? '' : '/';
    const apiPrefix = slug.includes('pages') ? settings.apiPrefix :
        settings.apiPrefix.replace('/v2', '');

    return `${settings.apiOrigin}${apiPrefix}/${slug}${possibleSlash}`;
}

export default async function cmsFetch(path) {
    const url = path.replace(/[^?]+/, urlFromSlug);

    return await (await fetch(url)).json();
}

/**
 * For CMS data that will not change within a session
 */
export const fetchOnce = memoize(cmsFetch);

/**
 * The returned function only runs its callback once
 * This is for components' pageData handlers, which would otherwise
 * no-op update pageData on every update. Not a very big deal, but it
 * bothered me.
 */
export const handleOnce = (slug) => {
    let alreadyHandled = false;
    const promise = fetchOnce(slug);

    return (callback) => {
        if (!alreadyHandled) {
            alreadyHandled = true;
            promise.then(callback);
        }
    };
};
