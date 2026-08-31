import * as Sentry from '@sentry/react';
import isSupported from '~/helpers/device';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageVersion = require('../../package.json').version;

const ignoreErrors = [
    'TypeError: Failed to fetch',
    'TypeError: Load failed',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: cancelled',
    'TypeError: Cancelled',
    'TypeError: e is undefined',
    'TypeError: Cannot read properties of undefined (reading \'default\')',
    'TypeError: Cannot read property \'default\' of undefined',
    'TypeError: can\'t access dead object',
    'TypeError: null is not an object (evaluating \'this.parentNode.style\')',
    'TypeError: Cannot read properties of null (reading \'style\')',
    'UnhandledRejection: Non-Error promise rejection captured with value: Failed to load Google Analytics',
    'UnhandledRejection: Non-Error promise rejection captured with value: undefined',
    'TypeError: Cannot read properties of null (reading \'render\')',
    'TypeError: h is not a function. (In \'h("Could not load ".concat(e))\', \'h\' is undefined)',
    'SyntaxError: Unexpected token \'<\'',
    'SyntaxError: expected expression, got \'<\'',
    'message: cancelled',
    'cancelled',
    'Error: Different window already linked for window: _blank',
    'Error: Failed to load Google Analytics',
    'NS_ERROR_FAILURE: No error message',
    'SecurityError: The operation is insecure.', // Safari with disabled localStorage
    'URIError: URI malformed'
];

const ignoreMessages = [
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
    'Invalid call to runtime.sendMessage()'
];

const denyUrls = [
    'https://www.google-analytics.com/analytics.js',
    'https://js.pulseinsights.com'
];

function exceptionValue(event) {
    const values = event.exception?.values;

    return values?.length ? values[0].value : '';
}

// A rejected promise carrying a non-Error has no `message`, so reading only
// hint.originalException misses it. Sentry still records the rejected value as
// the exception value, which is what the ignore list needs to see.
function messageOf(event, error) {
    const value = error?.message || exceptionValue(event);

    return typeof value === 'string' ? value : '';
}

// eslint-disable-next-line complexity
function beforeSend(event, hint) {
    const message = messageOf(event, hint?.originalException);

    if (window.location.hostname !== 'openstax.org') {
        return null;
    }
    if (!isSupported()) {
        return null;
    }
    if (window.location.pathname.startsWith('/l/') || window.location.pathname.startsWith('/rex/')) {
        return null;
    }
    if (ignoreMessages.find((fragment) => message.includes(fragment))) {
        return null;
    }
    if (message.match(/mce-visual-caret/i)) {
        return null;
    }
    if (message.match(/unexpected token/i)) {
        event.fingerprint = ['unexpected token'];
    }
    if (message.match(/unexpected (eof|end)/i)) {
        event.fingerprint = ['unexpected end'];
    }
    if (message.match(/pulseinsights/i)) {
        event.fingerprint = ['pulseinsights'];
    }
    if (message.match(/localStorage/)) {
        event.fingerprint = ['localStorage'];
    }
    return event;
}

Sentry.init({
    dsn: 'https://68df3e19624c434eb975dafa316c03ff@o484761.ingest.sentry.io/5691260',
    release: `osweb@${process.env.RELEASE_VERSION || packageVersion}`,
    integrations: [Sentry.extraErrorDataIntegration()],
    environment: window.location.hostname,
    ignoreErrors,
    denyUrls,
    beforeSend
});
