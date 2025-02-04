import cmsFetch, {cmsPost} from '~/helpers/cms-fetch';

jest.mock('~/helpers/retry', () => ({
    __esModule: true,
    default() {throw new Error('retry failed');}
}));

const mockFetch = jest.fn().mockResolvedValue({
    json() {return 'hi';}
});

global.fetch = mockFetch;

describe('cms-fetch', () => {
    it('rejects when retry throws', async () => {
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
