import settings from 'settings';

export function getFields(field) {
    return fetch(`${settings.apiOrigin}${settings.apiPrefix}/errata-fields?field=${field}`).then((r) => r.json());
}
