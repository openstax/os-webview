import sfApiFetch from '~/models/sfapi';

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
    it('returns the parsed response', async () => {
        const returnValue = {things: ['a thing']};

        mockFetch.mockResolvedValue({json: () => Promise.resolve(returnValue)});
        expect(await sfApiFetch('things', '/search?name=a')).toEqual(returnValue);
    });
});
