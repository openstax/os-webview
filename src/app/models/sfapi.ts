import settings from '~/helpers/window-settings';

const subdomains = ['dev.', 'qa.', 'staging.'];
const subdomain =
    subdomains.find((sd) => settings().accountHref?.includes(sd)) || '';
const server = `https://${subdomain}salesforce.openstax.org`;

async function fetchCsrfToken() {
    const raw = await fetch(`${server}/api/v1/csrf`, {
        credentials: 'include',
        headers: {Accept: 'application/json'}
    });
    const {csrf_token: token} = await raw.json();

    return token as string;
}

export async function sfApiPost(
    objectType: string,
    data: object,
    method = 'POST'
) {
    try {
        const options = {
            credentials: 'include',
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': await fetchCsrfToken()
            },
            body: JSON.stringify(data)
        } as const;
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

type FetchOptions = {withCredentials?: boolean};

// Only safelisted headers are sent, so the GET needs no CORS preflight.
export default async function sfApiFetch(
    objectType: string,
    specifier = '',
    {withCredentials = false}: FetchOptions = {}
) {
    try {
        const raw = await fetch(`${server}/api/v1/${objectType}${specifier}`, {
            credentials: withCredentials ? 'include' : 'omit',
            headers: {Accept: 'application/json'}
        });
        const result = await raw.json();

        return result;
    } catch (err) {
        console.warn(`Fetch ${objectType}: ${err}`);
        return null;
    }
}
