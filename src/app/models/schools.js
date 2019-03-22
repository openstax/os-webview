import settings from 'settings';

export const schoolPromise = fetch(`${settings.apiOrigin}/apps/cms/api/salesforce/schools/`)
    .then((r) => r.json()).then((objList) => objList.map((obj) => obj.name));
