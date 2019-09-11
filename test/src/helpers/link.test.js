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
        const url = `${window.location.origin}/oxauth/logout`;

        expect(linkHelper.stripOpenStaxDomain(url)).toBe(url);
    });
    it('leaves oxauth on openstax.org', () => {
        const url = 'https://openstax.org/oxauth/logout';

        expect(linkHelper.stripOpenStaxDomain(url)).toBe(url);
    });
    it('recognizes external', () => {
        const urls = [
            `${window.location.origin}/oxauth/logout`,
            'https://openstax.org/oxauth/logout/'
        ];

        urls.forEach((url) => expect(linkHelper.isExternal(url)).toBe(true));
    });
});
