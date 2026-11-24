import settings from '~/helpers/window-settings';

// Only dev and production sfapi exist. QA uses the dev Salesforce sandbox;
// staging shares production Salesforce.
const sandboxEnvironments = ['dev.', 'qa.'];
const useSandbox = sandboxEnvironments.some((env) =>
    settings().accountHref?.includes(env)
);
const server = `https://${useSandbox ? 'dev.' : ''}salesforce.openstax.org`;

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
