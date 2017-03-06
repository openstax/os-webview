import settings from 'settings';

const partnerPromise = fetch(`${settings.apiOrigin}/api/pages/partners`)
.then((r) => r.json())
.then((a) => Object.keys(a.allies).map((k) => a.allies[k]));

export default partnerPromise;
