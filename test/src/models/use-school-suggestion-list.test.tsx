import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import * as Sentry from '@sentry/react';
import useMatchingSchools from '~/models/use-school-suggestion-list';
import * as CMSF from '~/helpers/cms-fetch';
import * as PostHog from '~/helpers/posthog-exceptions';

jest.mock('@sentry/react', () => ({captureException: jest.fn()}));

const reportToSentry = Sentry.captureException as jest.Mock;

describe('models/use-school-suggestion-list', () => {
    const saveFetch = global.fetch;

    function Component({searchTerm = ''}) {
        const {schoolNames, selectedSchool} = useMatchingSchools(searchTerm);

        return (
            <div>
                <div>{schoolNames.length}</div>
                <div>{selectedSchool ? selectedSchool.location : ''}</div>
            </div>
        );
    }

    // sfapi is unreachable, so every call falls through to the CMS
    function breakSfapi(reason: 'reject' | number) {
        global.fetch = jest.fn().mockImplementation((url: string) => {
            if (url.includes('salesforce.openstax.org')) {
                return reason === 'reject'
                    ? Promise.reject(new Error('expected'))
                    : Promise.resolve({ok: false, status: reason});
            }
            return saveFetch(url);
        });
    }

    function reported(message: string) {
        return expect.objectContaining({message: expect.stringContaining(message)});
    }

    jest.useFakeTimers();

    let reportToPostHog: jest.SpyInstance;

    beforeEach(() => {
        reportToSentry.mockClear();
        reportToPostHog = jest.spyOn(PostHog, 'captureException').mockImplementation(() => undefined);
    });

    afterEach(() => {
        global.fetch = saveFetch;
        jest.restoreAllMocks();
    });

    it('fetches schools', async () => {
        render(<Component searchTerm="American" />);
        await screen.findByText(6);
    });

    it('does not fetch below the minimum query length', () => {
        render(<Component searchTerm="Am" />);
        jest.runAllTimers();
        screen.getByText(0);
    });

    it('returns empty list for empty search string', () => {
        render(<Component searchTerm="" />);
        jest.runAllTimers();
        screen.getByText(0);
    });

    it.each([
        ['American Career College', 'Domestic'],
        ['Inter American University of Puerto Rico, Aibonito', 'Domestic'],
        ['Tarlac Agricultural University', 'Foreign'],
        ['Payakumbuh State Agricultural Polytechnic', 'Foreign']
    ])('reports %s as %s', async (name, location) => {
        render(<Component searchTerm={name} />);
        await screen.findByText(location);
    });

    it('takes a not-found from sfapi as the answer', async () => {
        global.fetch = jest.fn().mockResolvedValue({ok: false, status: 404});
        render(<Component searchTerm="Zzzqqx" />);
        jest.runAllTimers();
        await screen.findByText(0);
        expect(global.fetch).toHaveBeenCalled();
        expect(reportToSentry).not.toHaveBeenCalled();
    });

    it.each(['reject' as const, 500])(
        'falls back to the CMS when sfapi answers %s',
        async (reason) => {
            breakSfapi(reason);
            render(<Component searchTerm="Casper College" />);
            await screen.findByText(40);
        }
    );

    it('reports an sfapi failure before falling back', async () => {
        breakSfapi('reject');
        render(<Component searchTerm="Casper College" />);
        await screen.findByText(40);
        expect(reportToSentry).toHaveBeenCalledTimes(1);
        expect(reportToSentry).toHaveBeenCalledWith(reported('sfapi'));
        expect(reportToPostHog).toHaveBeenCalledWith(reported('sfapi'));
    });

    it('does not report an sfapi 5xx, which the CMS then answers', async () => {
        breakSfapi(500);
        render(<Component searchTerm="Casper College" />);
        await screen.findByText(40);
        expect(reportToSentry).not.toHaveBeenCalled();
    });

    it('falls back to the CMS when the sfapi body cannot be read', async () => {
        global.fetch = jest.fn().mockImplementation((url: string) =>
            url.includes('salesforce.openstax.org')
                ? Promise.resolve({
                      ok: true,
                      status: 200,
                      json: () => Promise.reject(new Error('connection dropped'))
                  })
                : saveFetch(url)
        );
        render(<Component searchTerm="Casper College" />);
        await screen.findByText(40);
        expect(reportToSentry).toHaveBeenCalledWith(reported('connection dropped'));
    });

    it('gives up and reports when the CMS fails too', async () => {
        breakSfapi('reject');
        jest.spyOn(CMSF, 'default').mockRejectedValue(new Error('expected'));
        render(<Component searchTerm="Casper College" />);
        jest.runAllTimers();
        // the list starts empty, so wait for the CMS failure itself
        await waitFor(() => {
            expect(reportToSentry).toHaveBeenCalledWith(reported('the CMS'));
        });
        expect(reportToPostHog).toHaveBeenCalledWith(reported('the CMS'));
        screen.getByText(0);
    });
});
