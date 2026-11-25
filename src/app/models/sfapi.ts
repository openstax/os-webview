import settings from '~/helpers/window-settings';

// Only dev and production sfapi exist. QA uses the dev Salesforce sandbox;
// staging shares production Salesforce.
const sandboxEnvironments = ['dev.', 'qa.'];
const useSandbox = sandboxEnvironments.some((env) =>
    settings().accountHref?.includes(env)
);
const server = `https://${useSandbox ? 'dev.' : ''}salesforce.openstax.org`;

async function fetchCsrfToken() {
    const raw = await fetch(`${server}/api/v1/csrf`, {
        credentials: 'include',
        headers: {Accept: 'application/json'}
    });
    const body = raw.ok ? await raw.json() : {};

    if (typeof body?.csrf_token !== 'string') {
        throw new Error(`no CSRF token (status ${raw.status})`);
    }
    return body.csrf_token as string;
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
            const body = await raw.json().catch(() => ({}));

            console.warn('Failed with status', raw.status);
            console.warn(body?.detail);
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
