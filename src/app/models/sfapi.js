const subdomains = ['dev.', 'qa.', 'staging.'];
const subdomain = subdomains.find((sd) => window.SETTINGS.accountHref.includes(sd)) || '';
const server = `https://${subdomain}salesforce.openstax.org`;

export async function sfApiPost(objectType, data, method = 'POST') {
    try {
        const options = {
            credentials: 'include',
            method,
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const raw = await fetch(`${server}/api/v1/${objectType}`, options);

        if (!raw.ok) {
            const text = await raw.json();

            console.warn('Failed with status', raw.status);
            console.warn(text.error);
        }
        return raw;
    } catch (err) {
        console.warn(`Fetch (${method}) ${objectType}: ${err}`);
        return null;
    }
}

export default async function sfApiFetch(objectType, specifier = '') {
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
