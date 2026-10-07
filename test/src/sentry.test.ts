import * as Sentry from '@sentry/react';
import '~/sentry';

jest.mock('@sentry/react', () => ({
    init: jest.fn(),
    extraErrorDataIntegration: jest.fn()
}));
jest.mock('~/helpers/device', () => ({
    __esModule: true,
    default: () => true
}));

type Frame = {filename?: string};
type SentryEvent = {exception?: {values: {stacktrace?: {frames: Frame[]}}[]}};

const options = (Sentry.init as jest.Mock).mock.calls[0][0];
const beforeSend: (event: SentryEvent) => SentryEvent | null = options.beforeSend;

function eventWithFrames(...filenames: string[]): SentryEvent {
    return {
        exception: {
            values: [{stacktrace: {frames: filenames.map((filename) => ({filename}))}}]
        }
    };
}

describe('sentry', () => {
    it('is disabled off production', () => {
        expect(window.location.hostname).toBe('dev.openstax.org');
        expect(options.enabled).toBe(false);
    });
    it('keeps errors with a frame in our bundles', () => {
        const event = eventWithFrames(
            'https://dev.openstax.org/details/books/biology-2e',
            'https://dev.openstax.org/dist/main-abc.min.js'
        );

        expect(beforeSend(event)).toBe(event);
    });
    it('drops errors that never touch our bundles', () => {
        expect(beforeSend(eventWithFrames(
            'https://dev.openstax.org/details/books/biology-2e',
            'chrome-extension://abc/content.js',
            'https://cdn.example.com/dist/lib.js'
        ))).toBeNull();
        expect(beforeSend(eventWithFrames(undefined as unknown as string))).toBeNull();
    });
    it('keeps errors with no stack to judge by', () => {
        const event: SentryEvent = {exception: {values: [{}]}};

        expect(beforeSend(event)).toBe(event);
        expect(beforeSend({})).toEqual({});
    });
});
