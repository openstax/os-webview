import fetchRexRelease from '~/models/rex-release';

// Data from rexOrigin/rex/environment.json
const environment = {
    release_id: 'v4/544d3e8' // eslint-disable-line camelcase
};
const release = {
    archiveUrl: '/apps/archive/20250116.201611',
    books: {
        '13ac107a-f15f-49d2-97e8-60ab2e3b519c': {
            defaultVersion: 'ebc5beb'
        },
        '9d8df601-4f12-4ac1-8224-b450bf739e5f': {
            defaultVersion: '60ff1bb'
        },
        '14fb4ad7-39a1-4eee-ab6e-3ef2482e3e22': {
            defaultVersion: 'ccce780',
            archiveOverride: 'override-value'
        }
    },
    code: '88243bfbf5dfb8c513081f296169251164ddcf08',
    id: 'v4/544d3e8'
};
const config = {
    APP_ENV: 'production',
    IS_PRODUCTION: true,
    DEPLOYED_ENV: 'server',
    ACCOUNTS_URL: 'https://openstax.org',
    ARCHIVE_URL: 'https://openstax.org',
    IMAGE_CDN_URL: 'https://openstax.org',
    OS_WEB_URL: 'https://openstax.org',
    SEARCH_URL: 'https://openstax.org',
    HIGHLIGHTS_URL: 'https://openstax.org',
    REACT_APP_ACCOUNTS_URL: '/accounts',
    REACT_APP_ARCHIVE: '20250116.201611',
    REACT_APP_ARCHIVE_URL: '/apps/archive/20250116.201611',
    REACT_APP_IMAGE_CDN_URL: '/apps/image-cdn',
    REACT_APP_OS_WEB_API_URL: '/apps/cms/api',
    REACT_APP_SEARCH_URL: '/open-search/api/v0',
    REACT_APP_HIGHLIGHTS_URL: '/highlights/api/v0',
    SENTRY_ENABLED: true,
    RELEASE_ID: 'v4/544d3e8',
    CODE_VERSION: '88243bfbf5dfb8c513081f296169251164ddcf08',
    FIXTURES: false,
    DEBUG: false,
    PORT: 8000,
    UNLIMITED_CONTENT: false
};
const contents = '*** contents ***';

function jsonized(content: unknown) {
    return Promise.resolve({
        json() {
            return content;
        }
    });
}

const fetchImplementation = (path: string) => {
    if (path.includes('environment')) {
        return jsonized(environment);
    }
    if (path.includes('release.json')) {
        return jsonized(release);
    }
    if (path.includes('config.json')) {
        return jsonized(config);
    }
    if (path.includes('/contents/')) {
        return jsonized(contents);
    }
    return jsonized(`Other path: ${path}`);
};
const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('models/rex-release', () => {
    it('fetches contents', async () => {
        mockFetch.mockImplementation(fetchImplementation);
        const result = await fetchRexRelease(
            'https://example.com/wvlink',
            '9d8df601-4f12-4ac1-8224-b450bf739e5f'
        );

        expect(result).toEqual(contents);
    });
    it('sets archiveOverride', async () => {
        // No real difference in the result;
        // exercises a branch of code for full coverage
        mockFetch.mockImplementation(fetchImplementation);
        const result = await fetchRexRelease(
            'https://example.com/wvlink',
            '14fb4ad7-39a1-4eee-ab6e-3ef2482e3e22'
        );

        expect(result).toEqual(contents);
    });
    // Kind of slow due to retry
    it('handles environment fail', async () => {
        mockFetch.mockImplementation((path: string) => {
            if (path.includes('environment')) {
                return Promise.reject('expected rejection');
            }
            return fetchImplementation(path);
        });

        await expect(fetchRexRelease(
            'https://example2.com/wvlink',
            'will-not-find'
        )).rejects.toThrow();
    });
});
