import tableOfContentsHtml from '~/models/table-of-contents-html';

const mockFetchRexRelease = jest.fn();
const cnxData = {
    tree: {
        contents: [
            {
                title: 'chapter',
                slug: 'whoop',
                contents: [
                    {
                        title: 'section',
                        slug: undefined,
                        shortId: 'whoop-1-1'
                    }
                ]
            }
        ]
    }
};

jest.mock('~/models/rex-release', () => ({
    __esModule: true,
    default: () => mockFetchRexRelease()
}));

describe('models/table-of-contents-html', () => {
    it('handles fetch error', async () => {
        const saveWarn = console.warn;

        console.warn = jest.fn();
        mockFetchRexRelease.mockRejectedValue({
            error: 'expected'
        });
        expect(
            await tableOfContentsHtml({
                cnxId: 'foo',
                webviewLink: 'bar'
            })
        ).toBe('');
        expect(console.warn).toHaveBeenCalled();
        console.warn = saveWarn;
    });
    it('builds TOC from tree', async () => {
        mockFetchRexRelease.mockResolvedValue(cnxData);
        expect(
            await tableOfContentsHtml({
                cnxId: 'foo',
                webviewLink: 'bar'
            })
            /* eslint-disable quotes */
        ).toMatchInlineSnapshot(
            `"chapter<ul class=\\"no-bullets\\"><li><a href=\\"bar/pages/whoop-1-1\\">section</a></li></ul>"`
        );
    });
});
