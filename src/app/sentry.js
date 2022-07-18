import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';
import $ from '~/helpers/$';

const packageVersion = require('../../package.json').version;

const ignoreErrors = [
    'TypeError: Failed to fetch',
    'TypeError: Load failed',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: cancelled',
    'TypeError: Cancelled',
    'TypeError: Cannot read properties of undefined (reading \'default\')',
    'UnhandledRejection: Non-Error promise rejection captured with value: Failed to load Google Analytics',
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
    'Failed to load Google Analytics',
    'operation was aborted',
    'Object Not Found Matching Id',
    'The string did not match the expected pattern.',
    'chrome is not defined'
];

const ignoreUrls = [
    'https://www.google-analytics.com/analytics.js',
    'https://js.pulseinsights.com'
];

// eslint-disable-next-line complexity
function beforeSend(event, hint) {
    const error = hint.originalException;

    if (window.location.hostname !== 'openstax.org') {
        return null;
    }
    if (!$.isSupported()) {
        return null;
    }
    if (window.location.pathname.startsWith('/l/') || window.location.pathname.startsWith('/rex/')) {
        return null;
    }
    if (ignoreMessages.find((fragment) => error?.message?.includes(fragment))) {
        return null;
    }
    if (error?.message?.match(/mce-visual-caret/i)) {
        return null;
    }
    if (error?.message?.match(/unexpected token/i)) {
        event.fingerprint = ['unexpected token'];
    }
    if (error?.message?.match(/unexpected (eof|end)/i)) {
        event.fingerprint = ['unexpected end'];
    }
    if (error?.message?.match(/pulseinsights/i)) {
        event.fingerprint = ['pulseinsights'];
    }
    if (error?.message?.match(/loading chunk/i)) {
        event.fingerprint = ['loading chunk'];
    }
    if (error?.message?.match(/localStorage/)) {
        event.fingerprint = ['localStorage'];
    }
    return event;
}

Sentry.init({
    dsn: 'https://68df3e19624c434eb975dafa316c03ff@o484761.ingest.sentry.io/5691260',
    release: `osweb@${packageVersion}`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.05,
    environment: window.location.hostname,
    ignoreErrors,
    ignoreUrls,
    beforeSend
});
