import settings from '~/helpers/window-settings';

const subdomains = ['dev.', 'qa.', 'staging.'];
const subdomain =
    subdomains.find((sd) => settings().accountHref?.includes(sd)) || '';
const server = `https://${subdomain}salesforce.openstax.org`;

export default async function sfApiFetch(objectType: string, specifier = '') {
    try {
        const raw = await fetch(`${server}/api/v1/${objectType}${specifier}`, {
            credentials: 'include',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: 'no-0d4zFOeMPUmfxkCjHocCuoLa2SAGzBI8AREcH3eP3758F672DppA'
            }
        });
        const result = await raw.json();

        return result;
    } catch (err) {
        console.warn(`Fetch ${objectType}: ${err}`);
        return null;
    }
}
