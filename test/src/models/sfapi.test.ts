import sfApiFetch from '~/models/sfapi';

const mockFetch = jest.fn();

global.fetch = mockFetch;

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
