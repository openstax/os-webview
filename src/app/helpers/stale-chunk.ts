// A production deploy renames every content-hashed chunk, so a tab that was
// opened before it 404s on the next chunk it asks for. Reloading picks up the
// new index.html and its new chunk names; the counter stops a genuinely broken
// deploy from spinning the tab.
const RELOAD_KEY = 'osweb-stale-chunk-reloads';
const MAX_RELOADS = 2;

function reloadsSoFar() {
    try {
        return Number(window.sessionStorage.getItem(RELOAD_KEY)) || 0;
    } catch {
        // Storage is blocked (Safari private browsing); without a counter we
        // cannot rule out a reload loop, so decline to reload at all.
        return MAX_RELOADS;
    }
}

function isChunkLoadError(error: unknown) {
    const {name, message} = (error ?? {}) as Partial<Error>;

    return name === 'ChunkLoadError' || (/Loading chunk \S+ failed/i).test(message ?? '');
}

// A missing chunk that the server answers with an HTML page parses as markup,
// not script. That surfaces as a SyntaxError against the chunk's own url.
function isOurScript(url: string) {
    try {
        const {origin, pathname} = new URL(url);

        return origin === window.location.origin && pathname.startsWith('/dist/');
    } catch {
        return false;
    }
}

function reload() {
    try {
        window.sessionStorage.setItem(RELOAD_KEY, String(reloadsSoFar() + 1));
    } catch {
        return false;
    }
    window.location.reload();

    return true;
}

function reloadOnce() {
    return reloadsSoFar() < MAX_RELOADS && reload();
}

// Returns true when it has taken over recovery, so callers know not to also
// report the error.
export default function recoverFromStaleChunk(error: unknown) {
    return isChunkLoadError(error) && reloadOnce();
}

export function handleScriptError(event: ErrorEvent) {
    if (event.error instanceof SyntaxError && isOurScript(event.filename)) {
        reloadOnce();
    }
}

export function listenForStaleChunks() {
    window.addEventListener('error', handleScriptError);
    window.addEventListener('unhandledrejection', (event) =>
        recoverFromStaleChunk(event.reason)
    );
}
