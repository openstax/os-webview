import linkHelper from '~/helpers/link';

describe('stripOpenStaxDomain', () => {
    it('has an origin set', () => {
        expect(window.location.origin).toMatch('openstax.org');
    });
    it('strips subjects', () => {
        const url = `${window.location.origin}/subjects`;

        expect(linkHelper.stripOpenStaxDomain(url)).toBe('/subjects');
    });
    it('leaves oxauth', () => {
        const url = `${window.location.origin}/oxauth`;

        expect(linkHelper.stripOpenStaxDomain(url)).toBe(url);
    });
});
