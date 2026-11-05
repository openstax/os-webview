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

    it('sets the app and release for the analytics helper', async () => {
        const dataLayer: object[] = [];

        (window as unknown as {dataLayer: unknown[]}).dataLayer = dataLayer;
        jest.resetModules();
        await import('~/helpers/tag-manager');

        expect(dataLayer).toContainEqual({'os.app': 'os-webview', 'os.release_id': process.env.RELEASE_VERSION});
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

    it('sets the organization and user, then loads the scripts in order from the dev RAM off production', async () => {
        const dataLayer = (window as unknown as {dataLayer: object[]}).dataLayer;

        expect(window.location.hostname).toBe('dev.openstax.org');
        initializeEventCapture('sf-account-id');

        expect(dataLayer).toContainEqual({'os.organization_id': 'sf-account-id'});
        await waitFor(() => {
            expect(scriptSources()).toEqual([
                'https://dev.ram.sandbox.openstax.org/quasar/standalone.umd.js',
                'https://dev.ram.sandbox.openstax.org/analytics/helper.js'
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

describe('tag-manager initializeAnalytics', () => {
    type SchoolData = {industry: string; salesforceId: string; researchAgreementActive: boolean};
    const k12 = {industry: 'K12', salesforceId: 'sf-a', researchAgreementActive: false};
    const researchA = {...k12, researchAgreementActive: true};
    let initializeAnalytics: (schoolData: SchoolData | null) => void;

    const dataLayer = () => (window as unknown as {dataLayer: object[]}).dataLayer;

    beforeEach(async () => {
        (window as unknown as {dataLayer: object[]}).dataLayer = [];
        // A fresh copy, since the module remembers which analytics it loaded
        jest.resetModules();
        ({initializeAnalytics} = await import('~/helpers/tag-manager'));
    });

    it('loads GTM, with no organization, for a page with no school', () => {
        initializeAnalytics(null);

        expect(dataLayer()).toContainEqual(expect.objectContaining({event: 'gtm.js'}));
        expect(dataLayer()).not.toContainEqual(expect.objectContaining({'os.organization_id': expect.anything()}));
    });

    it('sets the organization, then loads GTM, for a school that is not K12', () => {
        initializeAnalytics({...k12, industry: 'Higher Education'});

        const organizationAt = dataLayer().findIndex((entry) => 'os.organization_id' in entry);
        const gtmAt = dataLayer().findIndex((entry) => 'event' in entry && entry.event === 'gtm.js');

        expect(dataLayer()[organizationAt]).toEqual({'os.organization_id': 'sf-a'});
        expect(organizationAt).toBeLessThan(gtmAt);
    });

    it('loads only event capture for a K12 school with a research agreement', () => {
        initializeAnalytics(researchA);

        expect(dataLayer()).toContainEqual({'os.organization_id': 'sf-a'});
        expect(dataLayer()).not.toContainEqual(expect.objectContaining({event: 'gtm.js'}));
    });

    it('loads nothing for a K12 school without a research agreement', () => {
        const entriesBefore = dataLayer().length;

        initializeAnalytics(k12);

        expect(dataLayer()).toHaveLength(entriesBefore);
    });
});
