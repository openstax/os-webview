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
    it('rejects when response json parsing fails', async () => {
        (retry as jest.Mock).mockResolvedValueOnce({
            json() {
                return Promise.reject(new Error('json failed'));
            }
        });

        await expect(cmsFetch('anything')).rejects.toThrow(
            'Failed to fetch anything: Error: json failed'
        );
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
