import settings from 'settings';

export default fetch(`${settings.apiOrigin}${settings.apiPrefix}/mapbox`)
    .then((r) => r.json())
    .then((r) => r[0]);
