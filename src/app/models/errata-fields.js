import settings from 'settings';

export async function getFields(field) {
    return fetch(`${settings.apiOrigin}${settings.apiPrefix}/errata-fields?field=${field}`).then((r) => r.json());
}
