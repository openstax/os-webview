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
    it('handles invalid url click', () => {
        const el = document.createElement('a');

        expect(linkHelper.validUrlClick({target: el} as unknown as React.MouseEvent)).toBe(false);
    });
});
describe('logoutLink', () => {
    it('generates a logoutLink', () => {
        const link = linkHelper.logoutLink();

        expect(link).toMatch('accounts/logout');
    });
});
describe('setUtmCampaign', () => {
    it('adds utm_campaign parameter to valid URL', () => {
        const url = 'https://example.com/path?existing=param';
        const result = linkHelper.setUtmCampaign(url, 'book-details');

        expect(result).toBe('https://example.com/path?existing=param&utm_campaign=book-details');
    });
    it('adds utm_campaign parameter to URL without existing params', () => {
        const url = 'https://example.com/path';
        const result = linkHelper.setUtmCampaign(url, 'subjects-dropdown');

        expect(result).toBe('https://example.com/path?utm_campaign=subjects-dropdown');
    });
    it('returns original URL when URL parsing fails', () => {
        const invalidUrl = 'not a valid url';
        const result = linkHelper.setUtmCampaign(invalidUrl, 'book-details');

        expect(result).toBe(invalidUrl);
    });
});
