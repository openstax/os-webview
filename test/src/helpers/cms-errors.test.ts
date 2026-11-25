import {
    applyCmsRules,
    cmsEndpoint,
    CmsUnreachableError,
    NotJsonError
} from '~/helpers/cms-errors';

describe('cmsEndpoint', () => {
    it.each([
        ['emergency/', 'emergency'],
        ['donations/sitebanner/', 'donations'],
        ['pages/?type=books.Book&fields=x', 'pages'],
        ['oxmenus/?placement=footer', 'oxmenus'],
        ['books/biology-2e', 'books'],
        ['/books/biology-2e', 'books'],
        ['', '']
    ])('%s is endpoint %s', (path, endpoint) => {
        expect(cmsEndpoint(path)).toBe(endpoint);
    });
});

describe('error classes', () => {
    it('describes an unreachable CMS without the browser text', () => {
        const error = new CmsUnreachableError('pages/?type=x', new TypeError('Failed to fetch'));

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('CmsUnreachableError');
        expect(error.message).toBe('Couldn\'t reach the CMS for pages/?type=x');
        expect(error.path).toBe('pages/?type=x');
        expect(error.endpoint).toBe('pages');
        expect(error.reason).toBe('TypeError: Failed to fetch');
    });
    it('describes a body that is not JSON', () => {
        const error = new NotJsonError('books/biology-2e', 502, 'text/html');

        expect(error.name).toBe('NotJsonError');
        expect(error.message).toBe('CMS returned text/html instead of JSON (HTTP 502) for books/biology-2e');
        expect(error.path).toBe('books/biology-2e');
        expect(error.endpoint).toBe('books');
    });
});

describe('applyCmsRules', () => {
    it('keeps the first unreachable error per endpoint as a warning', () => {
        const event = {tags: {existing: 'yes'}};
        const result = applyCmsRules(event, new CmsUnreachableError('alpha/one/', 'x'));

        expect(result).toMatchObject({
            level: 'warning',
            fingerprint: ['CmsUnreachableError', 'alpha'],
            tags: {existing: 'yes', 'cms_endpoint': 'alpha'}
        });
    });
    it('drops repeats on the same endpoint, whatever the path', () => {
        expect(applyCmsRules({}, new CmsUnreachableError('bravo/one', 'x'))).not.toBeNull();
        expect(applyCmsRules({}, new CmsUnreachableError('bravo/two', 'y'))).toBeNull();
    });
    it('counts endpoints separately', () => {
        expect(applyCmsRules({}, new CmsUnreachableError('charlie', 'x'))).not.toBeNull();
        expect(applyCmsRules({}, new CmsUnreachableError('delta', 'x'))).not.toBeNull();
    });
    it('counts the two error kinds separately and keeps not-JSON at error level', () => {
        expect(applyCmsRules({}, new CmsUnreachableError('echo', 'x'))).not.toBeNull();

        const result = applyCmsRules({}, new NotJsonError('echo', 502, 'text/html'));

        expect(result).toMatchObject({level: 'error', fingerprint: ['NotJsonError', 'echo']});
        expect(applyCmsRules({}, new NotJsonError('echo', 502, 'text/html'))).toBeNull();
    });
    it('matches by name and endpoint, not by class', () => {
        const lookalike = Object.assign(new Error('x'), {name: 'NotJsonError', endpoint: 'foxtrot'});

        expect(applyCmsRules({}, lookalike)).toMatchObject({fingerprint: ['NotJsonError', 'foxtrot']});
    });
    it('leaves other events untouched, however often they repeat', () => {
        const event = {level: 'error'};

        [new Error('boom'), new TypeError('Failed to fetch'), 'text', null, undefined].forEach((exception) => {
            expect(applyCmsRules(event, exception)).toBe(event);
            expect(applyCmsRules(event, exception)).toBe(event);
        });
        expect(event).toEqual({level: 'error'});
    });
    it('leaves alone an error with a CMS name but no endpoint', () => {
        const event = {};

        expect(applyCmsRules(event, Object.assign(new Error('x'), {name: 'NotJsonError'}))).toBe(event);
    });
});
