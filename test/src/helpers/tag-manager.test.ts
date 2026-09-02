jest.mock('~/models/accounts-model', () => ({
    __esModule: true,
    default: {load: () => Promise.resolve(null)}
}));

import {initializeGTM} from '~/helpers/tag-manager';

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
