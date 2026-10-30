import $ from '~/helpers/$';

export default function urlFromSlug(initialSlug: string) {
    const slug = initialSlug === 'news' ? 'pages/openstax-news' : initialSlug;
    const possibleSlash = (slug.endsWith('/') || slug.includes('?')) ? '' : '/';
    const apiPrefix = slug.includes('pages') ? $.apiOriginAndPrefix :
        $.apiOriginAndOldPrefix;

    return `${apiPrefix}/${slug}${possibleSlash}`;
}

// For page and portal names taken from a URL. The router decodes escapes in a
// path segment, like %2F to / and %09 to a tab. A name with those could load
// another page's data (pages/a/../b) and put its name in links as `//host/…`,
// so only ASCII letters, digits, hyphens and underscores are allowed.
export function hasOnlySlugCharacters(name: string) {
    return (/^[\w-]+$/).test(name);
}
