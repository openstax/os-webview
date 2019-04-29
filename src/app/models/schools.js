import settings from 'settings';

export const schoolPromise = fetch(`${settings.apiOrigin}${settings.apiPrefix}/salesforce/schools/`)
    .then((r) => r.json()).then((objList) => objList.map((obj) => obj.name));
