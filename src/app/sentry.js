import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';

const packageVersion = require('../../package.json').version;

Sentry.init({
    dsn: 'https://8468b55bf5b2442d9d31840113399b10@o484761.ingest.sentry.io/5691260',
    release: `osweb@${packageVersion}`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.5,
    environment: window.location.hostname
});
