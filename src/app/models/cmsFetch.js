import settings from 'settings';

export default async function (path) {
    return await (await fetch(`${settings.apiOrigin}${settings.apiPrefix}/${path}`)).json();
}
