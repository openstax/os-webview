import settings from 'settings';

export default fetch(`${settings.apiOrigin}/api/books?format=json`)
    .then((r) => r.json())
    .then((r) => r.books);
