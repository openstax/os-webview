// Making scripts work, per https://stackoverflow.com/a/47614491/392102
//
// innerHTML never runs a <script> it parses, so markup set with
// dangerouslySetInnerHTML has inert scripts in it. Swapping each one for a
// freshly created equivalent gets the browser to run it.

// Marks a replacement as handled, so a later walk over the same container
// leaves it alone. An attribute rather than a WeakSet because the selector
// below does the filtering for us.
const ACTIVATED = 'data-activated';

// Inline sources that have already run in this page session. A repeat of the
// same snippet re-declares its top-level const/let/class in global scope, which
// is a SyntaxError. That scope outlives the element, so this has to be tracked
// per page rather than per container: remounting the component, or rendering
// the same CMS block in two places, produces a brand new <script> node running
// against the same window.
const alreadyRun = new Set<string>();

// Blob URLs of the inline scripts run on behalf of CMS embeds. Entries stay
// after the URL is revoked, because error stack frames keep carrying it.
const embedScriptUrls = new Set<string>();

export function isEmbedScriptUrl(url: string) {
    return embedScriptUrls.has(url);
}

const CLASSIC_TYPE = /^(application|text)\/(x-)?(java|ecma)script$/i;

// Only inline classic JavaScript can be run twice by wrapping it. A module
// would stop parsing inside a function (import/export/top-level await), and a
// data block such as application/ld+json would stop being valid JSON.
function isClassic(s: HTMLScriptElement) {
    const type = s.getAttribute('type')?.trim();

    return !type || CLASSIC_TYPE.test(type);
}

function sourceFor(text: string, wrappable: boolean) {
    if (!wrappable) {
        return text;
    }
    if (!alreadyRun.has(text)) {
        alreadyRun.add(text);
        return text;
    }

    // Scoping the repeat makes it harmless instead of fatal: its declarations
    // are function-local now, and anything the first run hung off window is
    // still there for it to find. The one thing this does change is a repeat
    // of a snippet that publishes a global with var/function for other code to
    // read -- that global now keeps its first-run value instead of being
    // reassigned. Self-contained snippets, which is all of them so far, do not
    // notice.
    return `(function () {\n${text}\n})();`;
}

// A script loaded from a blob: URL shows that URL in error stacks in every
// engine. An inline one reports the page's own URL, and WebKit ignores
// //# sourceURL, so this is the only way to tell CMS scripts apart in stacks.
function runFromBlob(newScript: HTMLScriptElement, source: string) {
    const url = URL.createObjectURL(
        new Blob([source], {type: 'text/javascript'})
    );

    embedScriptUrls.add(url);
    newScript.src = url;
}

function replacementFor(s: HTMLScriptElement) {
    const newScript = document.createElement('script');

    Array.from(s.attributes).forEach((a) =>
        newScript.setAttribute(a.name, a.value)
    );
    if (s.textContent) {
        const wrappable = !s.src && isClassic(s);

        const source = sourceFor(s.textContent, wrappable);

        if (wrappable && typeof URL.createObjectURL === 'function') {
            runFromBlob(newScript, source);
        } else {
            newScript.appendChild(document.createTextNode(source));
        }
    }
    newScript.async = false;
    // Marked before insertion, because inserting can run the script
    // synchronously (the text-node fallback) and the script itself can trigger
    // a re-render that walks this container again.
    newScript.setAttribute(ACTIVATED, 'true');

    return newScript;
}

// Runs every not-yet-activated script under `el`, in order, waiting for each
// external one to settle before starting the next. Returns a function that
// abandons the rest of the walk.
export default function activateScripts(el: HTMLElement) {
    const scripts = Array.from(
        el.querySelectorAll<HTMLScriptElement>(`script:not([${ACTIVATED}])`)
    );
    const walk = {cancelled: false};

    const processOne = () => {
        const s = walk.cancelled ? undefined : scripts.shift();

        if (!s) {
            return;
        }

        // Removed while the walk was waiting on an earlier script. Nothing to
        // replace, and a load promise for it would never settle.
        if (!s.parentNode) {
            processOne();

            return;
        }

        const newScript = replacementFor(s);
        const p = newScript.src
            ? new Promise((resolve) => {
                  newScript.onload = resolve;
                  // Without this, one 404 parks the chain forever and no later
                  // script in the block ever runs.
                  newScript.onerror = resolve;
              })
            : Promise.resolve();

        s.parentNode.replaceChild(newScript, s);

        p.then(() => {
            if (isEmbedScriptUrl(newScript.src)) {
                URL.revokeObjectURL(newScript.src);
            }
            processOne();
        });
    };

    processOne();

    // Called when the element unmounts or its markup changes, so a walk still
    // waiting on an external script cannot keep running alongside its
    // replacement.
    return () => {
        walk.cancelled = true;
    };
}
