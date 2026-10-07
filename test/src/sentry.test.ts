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
const page = 'https://dev.openstax.org/details/books/biology-2e';
const ourBundle = 'https://dev.openstax.org/dist/main-abc.min.js';
const vendor = 'https://cdn.example.com/dist/lib.js';
const extension = 'chrome-extension://abc/content.js';

function eventWithFrames(...filenames: (string | undefined)[]): SentryEvent {
    return {
        exception: {
            values: [{stacktrace: {frames: filenames.map((filename) => ({filename}))}}]
        }
    };
}

function sentOrDropped(event: SentryEvent) {
    return beforeSend(event) === null ? 'dropped' : 'sent';
}

describe('sentry', () => {
    it('is disabled off production', () => {
        expect(window.location.hostname).toBe('dev.openstax.org');
        expect(options.enabled).toBe(false);
    });
    it('keeps errors with a frame in our bundles', () => {
        expect(sentOrDropped(eventWithFrames(vendor, ourBundle))).toBe('sent');
    });
    it('drops errors made only of other origins', () => {
        expect(sentOrDropped(eventWithFrames(extension, vendor, '<anonymous>'))).toBe('dropped');
    });
    it('keeps inline scripts, which GTM tags and CMS embeds run as', () => {
        expect(sentOrDropped(eventWithFrames(page, vendor))).toBe('sent');
        expect(sentOrDropped(eventWithFrames('<anonymous>'))).toBe('sent');
    });
    it('keeps errors with no stack to judge by', () => {
        expect(sentOrDropped({exception: {values: [{}]}})).toBe('sent');
        expect(sentOrDropped({})).toBe('sent');
        expect(sentOrDropped(eventWithFrames(undefined))).toBe('sent');
    });
    describe('on Chrome or the Google app for iOS', () => {
        beforeEach(() => {
            jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
                'Mozilla/5.0 (iPad; CPU OS 26_6 like Mac OS X) CriOS/151.0.7922 Mobile/15E148'
            );
        });
        afterEach(() => jest.restoreAllMocks());

        it('drops inline-only stacks, since the browser injects its own', () => {
            expect(sentOrDropped(eventWithFrames(page, page))).toBe('dropped');
        });
        it('still keeps errors from our bundles or with no script frames', () => {
            expect(sentOrDropped(eventWithFrames(page, ourBundle))).toBe('sent');
            expect(sentOrDropped(eventWithFrames('<anonymous>'))).toBe('sent');
        });
    });
});
