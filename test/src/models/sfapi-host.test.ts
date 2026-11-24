const mockFetch = jest.fn();

global.fetch = mockFetch;

const cases = [
    ['dev', 'https://dev.openstax.org/accounts', 'https://dev.salesforce.openstax.org'],
    ['qa', 'https://qa.openstax.org/accounts', 'https://dev.salesforce.openstax.org'],
    ['staging', 'https://staging.openstax.org/accounts', 'https://salesforce.openstax.org'],
    ['production', 'https://openstax.org/accounts', 'https://salesforce.openstax.org']
];

describe('models/sfapi host selection', () => {
    it.each(cases)('%s website calls %s', async (_env, accountHref, host) => {
        jest.resetModules();
        jest.doMock('~/helpers/window-settings', () => ({
            __esModule: true,
            default: () => ({accountHref})
        }));
        mockFetch.mockResolvedValue({ok: true, json: async () => ({})});

        const {default: sfApiFetch} = await import('~/models/sfapi');

        await sfApiFetch('thing');
        expect(mockFetch).toHaveBeenLastCalledWith(
            `${host}/api/v1/thing`,
            expect.anything()
        );
    });
});
