jest.mock('~/models/accounts-model', () => ({
    __esModule: true,
    default: {load: () => Promise.resolve({uuid: 'user-uuid'})}
}));

import {waitFor} from '@testing-library/preact';
import {initializeEventCapture, initializeGTM} from '~/helpers/tag-manager';

describe('tag-manager consent defaults', () => {
    it('pushes each gtag command as one dataLayer entry', async () => {
        const dataLayer: IArguments[] = [];

        (window as unknown as {dataLayer: unknown[]}).dataLayer =
            dataLayer as unknown[];
        jest.resetModules();
        await import('~/helpers/tag-manager');

        const consent = dataLayer.find((entry) => entry[0] === 'consent');

        // The spread bug scattered the command into three separate entries;
        // one grouped entry proves the arguments object is pushed whole.
        expect(consent).toBeDefined();
        expect(consent).toHaveLength(3);
        expect(consent?.[1]).toBe('default');
        expect(typeof consent?.[2]).toBe('object');
    });
});

describe('tag-manager fbq stub', () => {
    beforeEach(() => {
        delete (window as unknown as {fbq?: unknown}).fbq;
        delete (window as unknown as {_fbq?: unknown})._fbq;
    });

    it('defines a queuing fbq/_fbq stub before GTM loads', () => {
        initializeGTM();

        const fbq = (window as unknown as {fbq?: {queue: unknown[]}}).fbq;

        expect(typeof fbq).toBe('function');
        expect((window as unknown as {_fbq?: unknown})._fbq).toBe(fbq);

        // Calling fbq before the real pixel loads must queue, not throw
        expect(() =>
            (window as unknown as {fbq: (...a: unknown[]) => void}).fbq(
                'track',
                'PageView'
            )
        ).not.toThrow();
        expect(fbq?.queue).toContainEqual(['track', 'PageView']);
    });
});

describe('tag-manager event capture', () => {
    const scriptSources = () =>
        Array.from(document.head.querySelectorAll('script')).map((s) => s.src);

    it('sets the organization and user, then loads the scripts in order', async () => {
        const dataLayer = (window as unknown as {dataLayer: object[]}).dataLayer;

        initializeEventCapture('sf-account-id');

        expect(dataLayer).toContainEqual({'os.organization_id': 'sf-account-id'});
        await waitFor(() => {
            expect(scriptSources()).toEqual([
                'https://ram.openstax.org/quasar/standalone.umd.js',
                'https://ram.openstax.org/analytics/helper.js'
            ]);
        });
        expect(dataLayer).toContainEqual({'os.user': {uuid: 'user-uuid'}});
        expect(
            Array.from(document.head.querySelectorAll('script')).every((s) => !s.async)
        ).toBe(true);
    });

    it('only loads the scripts once', async () => {
        initializeEventCapture('sf-account-id');
        await Promise.resolve();

        expect(scriptSources()).toHaveLength(2);
    });
});
