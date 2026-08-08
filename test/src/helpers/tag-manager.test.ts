jest.mock('~/models/accounts-model', () => ({
    __esModule: true,
    default: {load: () => Promise.resolve(null)}
}));

import {initializeGTM} from '~/helpers/tag-manager';

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
