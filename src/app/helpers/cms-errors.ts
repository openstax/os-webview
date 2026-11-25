// No imports: sentry.js loads this first, so it must not pull in app helpers.

type CmsErrorLike = {name: string; endpoint: string};
type RuleEvent = {level?: string; fingerprint?: string[]; tags?: Record<string, unknown>};

const levelByName: Record<string, string> = {
    CmsUnreachableError: 'warning',
    NotJsonError: 'error'
};
const reported = new Set<string>();

export function cmsEndpoint(path: string) {
    return path.split('?')[0].split('/').find(Boolean) ?? '';
}

export class CmsUnreachableError extends Error {

    path: string;
    endpoint: string;
    reason: string;

    // The browser's own text stays out of the message: Sentry's noise lists match it
    constructor(path: string, reason: unknown) {
        super(`Couldn't reach the CMS for ${path}`);
        this.name = 'CmsUnreachableError';
        this.path = path;
        this.endpoint = cmsEndpoint(path);
        this.reason = String(reason);
    }

}

// Says what the CMS sent rather than passing on the browser's SyntaxError, whose
// wording differs per engine and is on Sentry's noise lists.
export class NotJsonError extends Error {

    path: string;
    endpoint: string;

    constructor(path: string, status: number, contentType: string) {
        super(`CMS returned ${contentType} instead of JSON (HTTP ${status}) for ${path}`);
        this.name = 'NotJsonError';
        this.path = path;
        this.endpoint = cmsEndpoint(path);
    }

}

function isCmsError(error: unknown): error is CmsErrorLike {
    const candidate = error as Partial<CmsErrorLike> | null | undefined;

    return (
        typeof candidate?.name === 'string' &&
        typeof candidate.endpoint === 'string' &&
        candidate.name in levelByName
    );
}

// One Sentry issue per endpoint and error kind, counted once per page load
export function applyCmsRules<E extends RuleEvent>(event: E, originalException: unknown): E | null {
    if (!isCmsError(originalException)) {
        return event;
    }
    const {name, endpoint} = originalException;
    const key = `${name}:${endpoint}`;

    if (reported.has(key)) {
        return null;
    }
    reported.add(key);
    event.level = levelByName[name];
    event.fingerprint = [name, endpoint];
    event.tags = {...event.tags, 'cms_endpoint': endpoint};
    return event;
}
