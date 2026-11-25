import cmsFetch, {cmsPost} from '~/helpers/cms-fetch';
import retry from '~/helpers/retry';

jest.mock('~/helpers/retry', () => ({
    __esModule: true,
    default: jest.fn(() => {
        throw new Error('retry failed');
    })
}));

const mockFetch = jest.fn().mockResolvedValue({
    json() {return 'hi';}
});

global.fetch = mockFetch;

describe('cms-fetch', () => {
    const htmlResponse = (status: number, contentType: string | null) => ({
        status,
        headers: {get: (name: string) => (name === 'content-type' ? contentType : null)},
        json() {
            return Promise.reject(new SyntaxError('Unexpected token \'<\''));
        }
    });

    it('says what the CMS sent when a 200 body is not JSON', async () => {
        (retry as jest.Mock).mockResolvedValueOnce(htmlResponse(200, 'text/html; charset=utf-8'));

        await expect(cmsFetch('emergency/')).rejects.toThrow(
            new Error('CMS returned text/html instead of JSON (HTTP 200) for emergency/')
        );
    });
    it('says what the CMS sent when a 502 body is not JSON', async () => {
        (retry as jest.Mock).mockResolvedValueOnce(htmlResponse(502, 'text/html'));

        await expect(cmsFetch('emergency/')).rejects.toThrow(
            new Error('CMS returned text/html instead of JSON (HTTP 502) for emergency/')
        );
    });
    it('says so when the response has no content type', async () => {
        (retry as jest.Mock).mockResolvedValueOnce(htmlResponse(502, null));

        await expect(cmsFetch('emergency/')).rejects.toThrow(
            new Error('CMS returned no content type instead of JSON (HTTP 502) for emergency/')
        );
    });
    it('keeps the old message when fetch fails', async () => {
        (retry as jest.Mock).mockRejectedValueOnce(new TypeError('Load failed'));

        await expect(cmsFetch('anything')).rejects.toThrow(
            new Error('Failed to fetch anything: TypeError: Load failed')
        );
    });
    it('returns the parsed body of a non-OK JSON response', async () => {
        (retry as jest.Mock).mockResolvedValueOnce({
            status: 400,
            json: () => Promise.resolve({detail: 'bad'})
        });

        await expect(cmsFetch('anything')).resolves.toEqual({detail: 'bad'});
    });
    it('rejects when retry throws', async () => {
        (retry as jest.Mock).mockImplementationOnce(() => {
            throw new Error('retry failed');
        });
        await expect(cmsFetch('anything')).rejects.toThrow();
    });
});

describe('cms-post', () => {
    it('calls fetch', async () => {
        const result = await cmsPost('path?extra', {data: 'value'} as any, 'POST');

        expect(mockFetch).toHaveBeenCalled();
        expect(result).toBe('hi');
    });
    it('handles rejection', async () => {
        mockFetch.mockResolvedValue({});
        await expect(cmsPost('path?extra', {} as any, 'DELETE')).rejects.toThrow();
    });
});
