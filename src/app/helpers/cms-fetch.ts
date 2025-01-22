import retry from '~/helpers/retry';
import urlFromSlug from './url-from-slug';

export default async function cmsFetch(path: string) {
    const url = path.replace(/[^?]+/, urlFromSlug);

    try {
        return (await retry(() => fetch(url))).json();
    } catch (err) {
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
    } catch (e) {
        return Promise.reject(new Error(`Failed to ${method} ${url}${qs}`));
    }
}
