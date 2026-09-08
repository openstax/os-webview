// Exception noise policy, shared by Sentry (src/app/sentry.js) and by the
// PostHog exception autocapture that GTM loads (src/app/helpers/posthog.ts).
// Keeping one list means a message the team has already decided to ignore is
// ignored everywhere, instead of sitting at the top of one tool's issue list.
//
// Sentry's own `ignoreErrors` stays in sentry.js and is deliberately not shared:
// Sentry substring-matches it against the whole exception value, so an entry
// like 'TypeError: Failed to fetch' also swallows our own
// `Failed to fetch <slug>: ... TypeError: Failed to fetch` CMS failures, which
// are exactly the ones we want to keep seeing.

export const ignoreMessages = [
    'g.readyState',
    'PulseInsightsObject.survey',
    'script.crazyegg.com',
    '//zamant.ru/',
    'Cross-origin redirection',
    'QuotaExceededError',
    'window.webkit.messageHandlers',
    'Failed to read the \'localStorage\' property from \'Window\'',
    'b is not a function.',
    'evaluating \'e.default\'',
    'IDBFactory.open() called',
    'Failed to load Google Analytics',
    'operation was aborted',
    'Object Not Found Matching Id',
    'The string did not match the expected pattern.',
    'chrome is not defined',
    'Loading chunk',
    'window.mobileAPI',
    'wistia.com',
    't.behaviors.embed.embed',
    // Firefox/Brave iOS inject a YouTube shim into every page; when it runs
    // before its own globals exist it throws in our page's context.
    '__firefox__',
    // Android WebView bridges, from apps that embed openstax.org in-app.
    'Java object is gone',
    'Java bridge method invocation error',
    // Browser extensions talking to a background page that has gone away.
    'Invalid call to runtime.sendMessage()',
    // A third-party tag fired by GTM; the whole stack is inside gtm.js.
    'AviviD is not defined'
];

// Browser extensions run in our page's context, so what they throw arrives
// looking like our own exception with our own url. The stack gives them away:
// every frame carries the extension's scheme. Safari masks its extension frames
// as `webkit-masked-url://hidden/`, the other engines use their own scheme.
export const denyFrameSchemes = [
    'webkit-masked-url:',
    'chrome-extension:',
    'moz-extension:',
    'safari-extension:',
    'safari-web-extension:',
    'ms-browser-extension:'
];

export const denyUrls = [
    'https://www.google-analytics.com/analytics.js',
    'https://js.pulseinsights.com'
];

export function isIgnoredMessage(message: string) {
    return ignoreMessages.some((fragment) => message.includes(fragment));
}

// Only when *every* frame is from a denied scheme: a stack that merely passes
// through an extension can still be reporting our bug.
export function isFromDeniedScheme(filenames: string[]) {
    return (
        filenames.length > 0 &&
        filenames.every((filename) =>
            denyFrameSchemes.some((scheme) => filename.startsWith(scheme))
        )
    );
}
