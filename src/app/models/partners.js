import settings from 'settings';

const partnerPromise = fetch(`${settings.apiOrigin}${settings.apiPrefix}/pages/partners`)
    .then((r) => r.json())
    .then((obj) => Object.values(obj.allies).filter((a) => !a.do_not_display));

export default partnerPromise;
