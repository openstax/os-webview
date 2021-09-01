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

Sentry.init({
    dsn: 'https://68df3e19624c434eb975dafa316c03ff@o484761.ingest.sentry.io/5691260',
    release: `osweb@${packageVersion}`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.05,
    environment: window.location.hostname,
    ignoreErrors,
    ignoreUrls
});
