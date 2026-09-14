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

function sourceFor(text: string) {
    if (!alreadyRun.has(text)) {
        alreadyRun.add(text);
        return text;
    }

    // Scoping the repeat makes it harmless instead of fatal: its declarations
    // are function-local now, and anything the first run hung off window is
    // still there for it to find.
    return `(function () {\n${text}\n})();`;
}

function replacementFor(s: HTMLScriptElement) {
    const newScript = document.createElement('script');

    Array.from(s.attributes).forEach((a) =>
        newScript.setAttribute(a.name, a.value)
    );
    if (s.textContent) {
        newScript.appendChild(document.createTextNode(sourceFor(s.textContent)));
    }
    newScript.async = false;
    // Marked before insertion, because inserting runs the script synchronously
    // and the script itself can trigger a re-render that walks this container
    // again.
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

        const newScript = replacementFor(s);
        const p = s.src
            ? new Promise((resolve) => {
                  newScript.onload = resolve;
                  // Without this, one 404 parks the chain forever and no later
                  // script in the block ever runs.
                  newScript.onerror = resolve;
              })
            : Promise.resolve();

        s.parentNode?.replaceChild(newScript, s);

        p.then(processOne);
    };

    processOne();

    // Called when the element unmounts or its markup changes, so a walk still
    // waiting on an external script cannot keep running alongside its
    // replacement.
    return () => {
        walk.cancelled = true;
    };
}
