import cmsFetch, {cmsPost} from '~/helpers/cms-fetch';
import * as Sentry from '@sentry/react';
import retry from '~/helpers/retry';
import {CmsUnreachableError, NotJsonError} from '~/helpers/cms-errors';

jest.mock('@sentry/react', () => ({captureException: jest.fn()}));
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

    beforeEach(() => (Sentry.captureException as jest.Mock).mockClear());

    it('says what the CMS sent when a 200 body is not JSON', async () => {
        (retry as jest.Mock).mockResolvedValueOnce(htmlResponse(200, 'text/html; charset=utf-8'));

        await expect(cmsFetch('emergency/')).rejects.toThrow(
            new Error('CMS returned text/html instead of JSON (HTTP 200) for emergency/')
        );
    });
    it('rejects with NotJsonError, reported once, when a 502 body is not JSON', async () => {
        (retry as jest.Mock).mockResolvedValueOnce(htmlResponse(502, 'text/html'));

        const failure = await cmsFetch('pages/?type=x').catch((err) => err);

        expect(failure).toBeInstanceOf(NotJsonError);
        expect(failure).toMatchObject({
            name: 'NotJsonError',
            message: 'CMS returned text/html instead of JSON (HTTP 502) for pages/?type=x',
            endpoint: 'pages'
        });
        expect(Sentry.captureException).toHaveBeenCalledTimes(1);
        expect(Sentry.captureException).toHaveBeenCalledWith(failure);
    });
    it('says so when the response has no content type', async () => {
        (retry as jest.Mock).mockResolvedValueOnce(htmlResponse(502, null));

        await expect(cmsFetch('emergency/')).rejects.toThrow(
            new Error('CMS returned no content type instead of JSON (HTTP 502) for emergency/')
        );
    });
    it('returns the parsed body of a non-OK JSON response', async () => {
        (retry as jest.Mock).mockResolvedValueOnce({
            status: 400,
            json: () => Promise.resolve({detail: 'bad'})
        });

        await expect(cmsFetch('anything')).resolves.toEqual({detail: 'bad'});
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });
    it('rejects with CmsUnreachableError, reported once, when the fetch fails', async () => {
        (retry as jest.Mock).mockImplementationOnce(() => {
            throw new TypeError('Failed to fetch');
        });

        const failure = await cmsFetch('emergency/').catch((err) => err);

        expect(failure).toBeInstanceOf(CmsUnreachableError);
        expect(failure.message).toBe('Couldn\'t reach the CMS for emergency/');
        expect(failure.reason).toBe('TypeError: Failed to fetch');
        expect(failure.endpoint).toBe('emergency');
        expect(Sentry.captureException).toHaveBeenCalledTimes(1);
        expect(Sentry.captureException).toHaveBeenCalledWith(failure);
    });
    it('does not report a successful fetch', async () => {
        (retry as jest.Mock).mockResolvedValueOnce({json: () => 'ok'});

        expect(await cmsFetch('anything')).toBe('ok');
        expect(Sentry.captureException).not.toHaveBeenCalled();
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
