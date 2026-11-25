import retry from '~/helpers/retry';
import urlFromSlug from './url-from-slug';

export class NotJsonError extends Error {

    name = 'NotJsonError';

}

// The browser's own SyntaxError wording differs per engine, and the noise
// filters match on it, so report what the CMS sent instead.
export async function readJson(response: Response, path: string) {
    try {
        return await response.json();
    } catch {
        const contentType = response.headers?.get('content-type')?.split(';')[0].trim() || 'no content type';

        throw new NotJsonError(
            `CMS returned ${contentType} instead of JSON (HTTP ${response.status}) for ${path}`
        );
    }
}

export default async function cmsFetch(path: string) {
    const url = path.replace(/[^?]+/, urlFromSlug);

    try {
        // `await` is required: without it .json() rejects outside the try
        return await readJson(await retry(() => fetch(url)), path);
    } catch (err) {
        if (err instanceof NotJsonError) {
            return Promise.reject(err);
        }
        return Promise.reject(new Error(`Failed to fetch ${path}: ${err}`));
    }
}

export async function cmsPost(path: string, payload: URLSearchParams, method: string) {
    const url = path.replace(/[^?]+/, urlFromSlug);
    const params = new window.URLSearchParams(payload);
    const qs = method.toLowerCase() === 'delete' ? `?${params}` : '';

    try {
        return (await fetch(`${url}${qs}`, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })).json();
    } catch {
        return Promise.reject(new Error(`Failed to ${method} ${url}${qs}`));
    }
}
