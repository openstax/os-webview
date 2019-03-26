import settings from 'settings';

export default fetch(`${settings.apiOrigin}/apps/cms/api/books?format=json`)
    .then((r) => r.json())
    .then((r) => r.books);
