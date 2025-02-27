import accountsModel from '~/models/accounts-model';

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('accounts-model', () => {
    const saveWarn = console.warn;

    afterEach(() => {
        accountsModel.load.invalidate();
        console.warn = saveWarn;
    });
    it('handles empty json response', async () => {
        mockFetch.mockResolvedValueOnce({json: () => Promise.resolve({})});
        expect(await accountsModel.load()).toEqual({});
    });
    it('catches rejection', async () => {
        console.warn = jest.fn();
        const err = new Error('expected');

        mockFetch.mockRejectedValueOnce(err);
        expect(await accountsModel.load()).toEqual({err});
        expect(console.warn).toHaveBeenCalled();
    });
    it('handles json response, window with dataLayer', async () => {
        const payload = {
            faculty_status: 'fs' // eslint-disable-line camelcase
        };
        const w = window as Window & {dataLayer?: []};

        w.dataLayer = [];

        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(payload)
        });
        expect(await accountsModel.load()).toEqual(payload);
        expect(w.dataLayer).toHaveLength(1);
        delete w.dataLayer;
    });
    it('handles json response, window without dataLayer', async () => {
        const payload = {
            faculty_status: 'fs' // eslint-disable-line camelcase
        };

        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(payload)
        });
        expect(await accountsModel.load()).toEqual(payload);
        // Test cache -- load will not be called
        expect(await accountsModel.load()).toEqual(payload);
    });
    it('warns if json rejects', async () => {
        console.warn = jest.fn();

        mockFetch.mockResolvedValueOnce({
            json: () => Promise.reject('whoops')
        });
        expect(await accountsModel.load()).toEqual({err: 'whoops'});
        expect(console.warn).toHaveBeenCalled();
    });
});
