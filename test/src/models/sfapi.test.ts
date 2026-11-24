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
    it('omits credentials and sends only Accept by default', async () => {
        mockFetch.mockResolvedValue({json: () => ({ok: true})});
        await sfApiFetch('thing', '?a=b');
        expect(mockFetch).toHaveBeenLastCalledWith(
            expect.stringContaining('/api/v1/thing?a=b'),
            {credentials: 'omit', headers: {Accept: 'application/json'}}
        );
    });
    it('includes credentials when withCredentials is set', async () => {
        mockFetch.mockResolvedValue({json: () => ({ok: true})});
        await sfApiFetch('thing', '', {withCredentials: true});
        expect(mockFetch).toHaveBeenLastCalledWith(
            expect.any(String),
            expect.objectContaining({credentials: 'include'})
        );
    });
});
