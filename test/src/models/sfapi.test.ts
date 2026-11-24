import sfApiFetch, {sfApiPost} from '~/models/sfapi';

const mockFetch = jest.fn();

global.fetch = mockFetch;

const tokenResponse = {json: () => ({csrf_token: 'tok123'})};

function mockPostResponse(response: object) {
    mockFetch
        .mockResolvedValueOnce(tokenResponse)
        .mockResolvedValueOnce(response);
}

describe('models/sfapi', () => {
    const saveWarn = console.warn;

    beforeEach(() => {
        mockFetch.mockReset();
    });
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

        mockPostResponse(returnValue);
        expect(await sfApiPost('thing', {data: 'foo'})).toEqual(returnValue);
    });
    it('handles post with no raw return', async () => {
        const returnValue = {
            ok: false,
            json: () => ({error: 'expected error'}),
            status: 'fail status'
        };

        console.warn = jest.fn();
        mockPostResponse(returnValue);
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
    it('requests a CSRF token with credentials before writing', async () => {
        mockPostResponse({ok: true});
        await sfApiPost('thing', {data: 'foo'});
        expect(mockFetch).toHaveBeenNthCalledWith(
            1,
            expect.stringMatching(/\/api\/v1\/csrf$/),
            {credentials: 'include', headers: {Accept: 'application/json'}}
        );
    });
    it('sends the token, credentials, method and body on the write', async () => {
        mockPostResponse({ok: true});
        await sfApiPost('thing', {data: 'foo'}, 'PUT');
        expect(mockFetch).toHaveBeenNthCalledWith(
            2,
            expect.stringMatching(/\/api\/v1\/thing$/),
            {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tok123'
                },
                body: JSON.stringify({data: 'foo'})
            }
        );
    });
    it('returns null and warns when the token fetch fails', async () => {
        console.warn = jest.fn();
        mockFetch.mockReset();
        mockFetch.mockRejectedValueOnce(new Error('no token'));
        expect(await sfApiPost('thing', {data: 'foo'})).toBeNull();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalled();
    });
});
