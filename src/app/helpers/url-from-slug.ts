import $ from '~/helpers/$';

export default function urlFromSlug(initialSlug) {
    const slug = initialSlug === 'news' ? 'pages/openstax-news' : initialSlug;
    const possibleSlash = (slug.endsWith('/') || slug.includes('?')) ? '' : '/';
    const apiPrefix = slug.includes('pages') ? $.apiOriginAndPrefix :
        $.apiOriginAndOldPrefix;

    return `${apiPrefix}/${slug}${possibleSlash}`;
}
