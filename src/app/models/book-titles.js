import settings from 'settings';

export const highSchoolSlugs = [
    'books/college-physics-ap-courses'
];

export const bookPromise = fetch(`${settings.apiOrigin}/api/v2/pages/?type=books.Book&fields=title,id`)
    .then((r) => r.json()).then((r) => r.items);
