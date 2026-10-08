import sfApiFetch, {sfApiPost} from '~/models/sfapi';

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('models/sfapi', () => {
    const saveWarn = console.warn;

    afterEach(() => {
        console.warn = saveWarn;
    });

    it('handles fetch error', async () => {
        console.warn = jest.fn();
        mockFetch.mockRejectedValue(new Error('expected error'));
        expect(await sfApiFetch('thing')).toBeNull();
        expect(console.warn).toHaveBeenCalled();
    });
    it('handles post error', async () => {
        console.warn = jest.fn();
        mockFetch.mockRejectedValue(new Error('expected error'));
        expect(await sfApiPost('thing', {data: 'foo'})).toBeNull();
        expect(console.warn).toHaveBeenCalled();
    });
    it('handles post with raw return', async () => {
        const returnValue = {
            ok: true,
            data: 'whatever'
        };

        mockFetch.mockResolvedValue(returnValue);
        expect(await sfApiPost('thing', {data: 'foo'})).toEqual(returnValue);
    });
    it('handles post with no raw return', async () => {
        const returnValue = {
            ok: false,
            json: () => ({error: 'expected error'}),
            status: 'fail status'
        };

        console.warn = jest.fn();
        mockFetch.mockResolvedValue(returnValue);
        expect(await sfApiPost('thing', {data: 'foo'})).toEqual(returnValue);
        expect(console.warn).toHaveBeenCalled();
    });
});
