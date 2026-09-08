import {beforeSend, captureException} from '~/helpers/posthog-exceptions';

type BeforeSend = Parameters<typeof beforeSend>[0];

function exceptionEvent(value: string, filenames: string[] = []) {
    return {
        event: '$exception',
        properties: {
            $exception_list: [
                {
                    value,
                    stacktrace: {frames: filenames.map((filename) => ({filename}))}
                }
            ]
        }
    } as BeforeSend;
}

function setPostHog(posthog: unknown) {
    (window as unknown as {posthog?: unknown}).posthog = posthog;
}

describe('posthog beforeSend', () => {
    it('passes through anything that is not an exception', () => {
        const pageview = {event: '$pageview'} as BeforeSend;

        expect(beforeSend(pageview)).toBe(pageview);
        expect(beforeSend(null)).toBeNull();
    });

    it('drops an exception on the shared noise list', () => {
        expect(beforeSend(exceptionEvent('Object Not Found Matching Id:4'))).toBeNull();
    });

    it('drops an exception thrown entirely inside a browser extension', () => {
        expect(
            beforeSend(
                exceptionEvent('undefined is not an object (evaluating \'e.fields.pageInfo\')', [
                    'webkit-masked-url://hidden/'
                ])
            )
        ).toBeNull();
    });

    it('keeps our own CMS fetch failure', () => {
        const ours = exceptionEvent(
            'Failed to fetch sticky/: Error: Maximum retries exceeded: TypeError: Failed to fetch',
            ['https://openstax.org/dist/main.js']
        );

        expect(beforeSend(ours)).toBe(ours);
    });

    it('keeps an exception with no value and no frames', () => {
        const bare = {event: '$exception', properties: {}} as BeforeSend;

        expect(beforeSend(bare)).toBe(bare);
    });

    it('keeps an exception whose value and frame filenames are missing', () => {
        const partial = {
            event: '$exception',
            properties: {
                $exception_list: [{}, {stacktrace: {frames: [{}]}}]
            }
        } as BeforeSend;

        expect(beforeSend(partial)).toBe(partial);
    });
});

// `installExceptionFilter` only ever installs once, so each test needs its own
// copy of the module.
async function freshModule() {
    let module = {} as typeof import('~/helpers/posthog-exceptions');

    jest.isolateModules(() => {
        module = jest.requireActual('~/helpers/posthog-exceptions');
    });

    return module;
}

describe('posthog interop', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        setPostHog(undefined);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('installs the filter once GTM has loaded and initialized PostHog', async () => {
        const posthogModule = await freshModule();
        const setConfig = jest.fn();

        posthogModule.installExceptionFilter();
        jest.advanceTimersByTime(1000);
        expect(setConfig).not.toHaveBeenCalled();

        // The snippet stub arrives first; only the initialized library counts.
        setPostHog({set_config: setConfig});
        jest.advanceTimersByTime(1000);
        expect(setConfig).not.toHaveBeenCalled();

        setPostHog({__loaded: true, set_config: setConfig});
        jest.advanceTimersByTime(1000);
        expect(setConfig).toHaveBeenCalledWith({before_send: posthogModule.beforeSend});

        // Installed once, and the poll stops.
        setConfig.mockClear();
        jest.advanceTimersByTime(60000);
        expect(setConfig).not.toHaveBeenCalled();
    });

    it('gives up polling on a page where PostHog never loads', async () => {
        const posthogModule = await freshModule();
        const clearInterval = jest.spyOn(window, 'clearInterval');

        posthogModule.installExceptionFilter();
        jest.advanceTimersByTime(60000);

        expect(clearInterval).toHaveBeenCalled();
        clearInterval.mockRestore();
    });

    it('reports a handled exception, and does nothing without PostHog', () => {
        const error = new Error('Failed to fetch sticky/');

        expect(() => captureException(error)).not.toThrow();

        const posthogCapture = jest.fn();

        // Loaded, but from a build without exception capture.
        setPostHog({__loaded: true, set_config: jest.fn()});
        expect(() => captureException(error)).not.toThrow();

        setPostHog({__loaded: true, set_config: jest.fn(), captureException: posthogCapture});
        captureException(error);

        expect(posthogCapture).toHaveBeenCalledWith(error);
    });

    it('installs only once', async () => {
        const posthogModule = await freshModule();
        const setConfig = jest.fn();

        setPostHog({__loaded: true, set_config: setConfig});
        posthogModule.installExceptionFilter();
        jest.advanceTimersByTime(1000);
        posthogModule.installExceptionFilter();
        jest.advanceTimersByTime(1000);

        expect(setConfig).toHaveBeenCalledTimes(1);
    });
});
