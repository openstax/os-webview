// Have to have a separate file to check the branch at line 4
import sfApiFetch from '~/models/sfapi';

jest.mock('~/helpers/window-settings', () => ({
    __esModule: true,
    default: () => ({
        accountsHref: 'https://openstax.org/accounts'
    })
}));

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('exercise the fallback subdomain', () => {
    const saveWarn = console.warn;

    it('handles fetch fail from salesforce (no subdomain)', async () => {
        console.warn = jest.fn();

        expect(await sfApiFetch('thing')).toBeNull();
        expect(console.warn).toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalledWith(
            'https://salesforce.openstax.org/api/v1/thing',
            expect.objectContaining({
                credentials: 'include'
            })
        );
        console.warn = saveWarn;
    });
});
