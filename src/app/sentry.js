import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';

const packageVersion = require('../../package.json').version;

const ignoreErrors = [
    'TypeError: Failed to fetch',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: cancelled',
    'TypeError: Cancelled',
    'message: cancelled',
    'cancelled'
];

const ignoreUrls = [
    'https://www.google-analytics.com/analytics.js'
];

// eslint-disable-next-line complexity
function beforeSend(event, hint) {
    const error = hint.originalException;

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
