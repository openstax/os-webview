import settings from 'settings';

export const bookPromise = fetch(
    `${settings.apiOrigin}${settings.apiPrefix}/v2/pages/?type=books.Book&fields=title,id&limit=250`
).then((r) => r.json()).then((r) => r.items);
