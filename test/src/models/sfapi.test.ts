import sfApiFetch, {sfApiPost} from '~/models/sfapi';

const mockFetch = jest.fn();

global.fetch = mockFetch;

const tokenResponse = {ok: true, json: () => ({csrf_token: 'tok123'})};

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
    it('returns the parsed response', async () => {
        const returnValue = {schools: ['a school']};

        mockFetch.mockResolvedValue({json: () => Promise.resolve(returnValue)});
        expect(await sfApiFetch('schools', '/search?name=a')).toEqual(returnValue);
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
            json: () => Promise.resolve({detail: 'expected error'}),
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
    it('returns null and warns when /csrf is not ok', async () => {
        console.warn = jest.fn();
        mockFetch.mockResolvedValueOnce({ok: false, status: 404});
        expect(await sfApiPost('thing', {data: 'foo'})).toBeNull();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalled();
    });
    it('returns null and warns when /csrf has no token', async () => {
        console.warn = jest.fn();
        mockFetch.mockResolvedValueOnce({ok: true, json: () => ({})});
        expect(await sfApiPost('thing', {data: 'foo'})).toBeNull();
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalled();
    });
    it('warns with status and detail on a failed write', async () => {
        const failure = {
            ok: false,
            status: 403,
            json: () => Promise.resolve({detail: 'CSRF check Failed'})
        };

        console.warn = jest.fn();
        mockPostResponse(failure);
        expect(await sfApiPost('thing', {data: 'foo'})).toBe(failure);
        expect(console.warn).toHaveBeenCalledWith('Failed with status', 403);
        expect(console.warn).toHaveBeenCalledWith('CSRF check Failed');
    });
    it('returns the response when a failed write has a non-JSON body', async () => {
        const failure = {
            ok: false,
            status: 502,
            json: () => Promise.reject(new Error('not json'))
        };

        console.warn = jest.fn();
        mockPostResponse(failure);
        expect(await sfApiPost('thing', {data: 'foo'})).toBe(failure);
        expect(console.warn).toHaveBeenCalledWith('Failed with status', 502);
    });
});
