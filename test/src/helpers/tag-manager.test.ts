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

    it('sets the user, then loads the scripts in order', async () => {
        const dataLayer = (window as unknown as {dataLayer: object[]}).dataLayer;

        initializeEventCapture();

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
        initializeEventCapture();
        await Promise.resolve();

        expect(scriptSources()).toHaveLength(2);
    });
});

describe('tag-manager initializeAnalytics', () => {
    type SchoolData = {industry: string; salesforceId: string; researchAgreementActive: boolean};
    const k12 = {industry: 'K12', salesforceId: 'sf-a', researchAgreementActive: false};
    const researchA = {...k12, researchAgreementActive: true};
    const researchB = {...researchA, salesforceId: 'sf-b'};
    const higherEdA = {...k12, industry: 'Higher Education'};
    const higherEdB = {...higherEdA, salesforceId: 'sf-b'};
    const savedLocation = window.location;
    let reload: jest.Mock;
    let initializeAnalytics: (schoolData: SchoolData | null) => void;

    const dataLayer = () => (window as unknown as {dataLayer: object[]}).dataLayer;

    beforeEach(async () => {
        reload = jest.fn();
        Reflect.defineProperty(window, 'location', {
            writable: true,
            value: {origin: 'https://openstax.org', pathname: '/', reload}
        });
        (window as unknown as {dataLayer: object[]}).dataLayer = [];
        // A fresh copy, since the module remembers which analytics it loaded
        jest.resetModules();
        ({initializeAnalytics} = await import('~/helpers/tag-manager'));
    });

    afterEach(() => {
        Reflect.defineProperty(window, 'location', {writable: true, value: savedLocation});
    });

    it('loads GTM, with no organization, for a page with no school', () => {
        initializeAnalytics(null);

        expect(dataLayer()).toContainEqual(expect.objectContaining({event: 'gtm.js'}));
        expect(dataLayer()).not.toContainEqual(expect.objectContaining({'os.organization_id': expect.anything()}));
    });

    it('sets the organization, then loads GTM, for a school that is not K12', () => {
        initializeAnalytics(higherEdA);

        const organizationAt = dataLayer().findIndex((entry) => 'os.organization_id' in entry);
        const gtmAt = dataLayer().findIndex((entry) => 'event' in entry && entry.event === 'gtm.js');

        expect(dataLayer()[organizationAt]).toEqual({'os.organization_id': 'sf-a'});
        expect(organizationAt).toBeLessThan(gtmAt);
    });

    it('sets the organization and loads only event capture for a K12 school with a research agreement', () => {
        initializeAnalytics(researchA);

        expect(dataLayer()).toContainEqual({'os.organization_id': 'sf-a'});
        expect(dataLayer()).not.toContainEqual(expect.objectContaining({event: 'gtm.js'}));
    });

    it('loads nothing, not even the organization, for a K12 school without a research agreement', () => {
        const entriesBefore = dataLayer().length;

        initializeAnalytics(k12);

        expect(dataLayer()).toHaveLength(entriesBefore);
    });

    // Otherwise GTM, loaded for the next page, would read that school's organization
    it('loads GTM without the earlier K12 school\'s organization', () => {
        initializeAnalytics(k12);
        initializeAnalytics(null);

        expect(reload).not.toHaveBeenCalled();
        expect(dataLayer()).toContainEqual(expect.objectContaining({event: 'gtm.js'}));
        expect(dataLayer()).not.toContainEqual({'os.organization_id': 'sf-a'});
    });

    it('does not set the new school\'s organization when reloading for it', () => {
        initializeAnalytics(researchA);
        initializeAnalytics(researchB);

        expect(reload).toHaveBeenCalled();
        expect(dataLayer()).not.toContainEqual({'os.organization_id': 'sf-b'});
    });

    it.each([
        ['no school', null, 'no school', null],
        ['a K12 school without an agreement', k12, 'no school', null],
        ['a school that is not K12', higherEdA, 'the same school', higherEdA],
        ['a research school', researchA, 'the same research school', researchA]
    ])('keeps the page when going from %s to %s', (_, first, __, second) => {
        initializeAnalytics(first);
        initializeAnalytics(second);

        expect(reload).not.toHaveBeenCalled();
    });

    it.each([
        ['no school', null, 'a school that is not K12', higherEdA],
        ['a school that is not K12', higherEdA, 'no school', null],
        ['a school that is not K12', higherEdA, 'another school that is not K12', higherEdB],
        ['no school', null, 'a K12 school without an agreement', k12],
        ['no school', null, 'a research school', researchA],
        ['a research school', researchA, 'another research school', researchB],
        ['a research school', researchA, 'a K12 school without an agreement', k12],
        ['a research school', researchA, 'no school', null]
    ])('reloads the page when going from %s to %s', (_, first, __, second) => {
        initializeAnalytics(first);
        initializeAnalytics(second);

        expect(reload).toHaveBeenCalled();
    });
});
