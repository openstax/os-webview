import * as Sentry from '@sentry/react';
import retry from '~/helpers/retry';
import {CmsUnreachableError, NotJsonError} from './cms-errors';
import urlFromSlug from './url-from-slug';

export function reported<E>(failure: E) {
    Sentry.captureException(failure);
    return failure;
}

function contentTypeOf(response: Response) {
    return response.headers?.get('content-type')?.split(';')[0].trim() || 'no content type';
}

// A connection that drops mid-body also rejects .json(). Safari's parse failure
// is a DOMException named SyntaxError, so check the name, not the class.
function isParseFailure(err: unknown) {
    return (err as {name?: string} | null)?.name === 'SyntaxError';
}

export async function readJson(response: Response, path: string) {
    try {
        return await response.json();
    } catch (err) {
        throw isParseFailure(err)
            ? new NotJsonError(path, response.status, contentTypeOf(response))
            : new CmsUnreachableError(path, err);
    }
}

export default async function cmsFetch(path: string) {
    const url = path.replace(/[^?]+/, urlFromSlug);
    let response;

    try {
        response = await retry(() => fetch(url));
    } catch (err) {
        return Promise.reject(reported(new CmsUnreachableError(path, err)));
    }

    try {
        // `await` is required: without it .json() rejects outside the try
        return await readJson(response, path);
    } catch (err) {
        return Promise.reject(reported(err));
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
