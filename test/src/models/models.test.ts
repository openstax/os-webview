import * as CF from '~/helpers/cms-fetch';
import * as FRR from '~/models/rex-release';
import * as PDU from '~/helpers/page-data-utils';
import bookToc from '~/models/book-toc';
import getFields from '~/models/errata-fields';

const mockCmsFetch = jest.spyOn(CF, 'default');
const mockCnxFetch = jest.spyOn(FRR, 'default');

describe('mapbox', () => {
    it('calls cmsFetch', async () => {
        mockCmsFetch.mockResolvedValue(['mapbox-value']);
        const mapbox = await import('~/models/mapbox');

        expect(await mapbox.default).toEqual('mapbox-value');
    });
});

describe('give-today', () => {
    function fromNow(offset: number) {
        return new Date(Date.now() + offset).toLocaleString();
    }
    it('passes test dates', async () => {
        jest.spyOn(PDU, 'useDataFromPromise').mockReturnValue({
            /* eslint-disable camelcase */
            menu_start: fromNow(-1000),
            menu_expires: fromNow(1000),
            start: fromNow(-2000),
            expires: fromNow(2000)
            /* eslint-enable camelcase */
        });
        const {default: useGiveToday} = await import('~/models/give-today');
        const {showButton, showLink} = useGiveToday();

        expect(showButton).toBe(true);
        expect(showLink).toBe(true);
    });
});

describe('book-toc', () => {
    it('calls cmsFetch and cnxFetch', async () => {
        mockCmsFetch.mockResolvedValue({
            /* eslint-disable camelcase */
            webview_rex_link: 'webview-rex-link',
            cnx_id: 'cnx-id'
            /* eslint-enable camelcase */
        });
        mockCnxFetch.mockResolvedValue({
            tree: {
                contents: 'tree-contents'
            }
        });
        const contents = await bookToc('book-slug');

        expect(contents).toBe('tree-contents');
        expect(mockCmsFetch).toHaveBeenCalled();
        expect(mockCnxFetch).toHaveBeenCalled();
    });
});

describe('errata-fields', () => {
    it('calls cmsFetch', async () => {
        jest.resetAllMocks();
        expect(mockCmsFetch).not.toHaveBeenCalled();
        mockCmsFetch.mockResolvedValue('errata-fields-values');
        expect(await getFields('')).toBe('errata-fields-values');
        expect(mockCmsFetch).toHaveBeenCalled();
    });
});

// savings and salesforce-partners are not testable
