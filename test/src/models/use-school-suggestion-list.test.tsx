import React from 'react';
import {render, screen, act} from '@testing-library/preact';
import * as Sentry from '@sentry/react';
import useMatchingSchools from '~/models/use-school-suggestion-list';
import * as SFAPI from '~/models/sfapi';
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
                <div data-testid="enrollment">
                    {selectedSchool ? `[${selectedSchool.total_school_enrollment}]` : ''}
                </div>
            </div>
        );
    }

    function stubSfapi(body: unknown) {
        return jest.spyOn(SFAPI, 'default').mockResolvedValue(body);
    }

    async function settle() {
        await act(async () => {
            jest.runAllTimers();
            await new Promise<void>((resolve) => {
                jest.useRealTimers();
                setTimeout(resolve, 20);
            });
            jest.useFakeTimers();
        });
    }

    function expectNoCmsRequest(fetchSpy: jest.Mock) {
        expect(fetchSpy.mock.calls.filter(([url]) => (/\/cms\/|salesforce\/schools/).test(String(url)))).toEqual([]);
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

    it('asks sfapi with the encoded query', async () => {
        const sfApiFetch = stubSfapi({schools: []});

        render(<Component searchTerm="St. Mary's & Sons" />);
        await settle();
        expect(sfApiFetch).toHaveBeenCalledTimes(1);
        expect(sfApiFetch).toHaveBeenCalledWith('schools', '?name=St.%20Mary\'s%20%26%20Sons');
    });

    async function expectNoRequests(searchTerm: string) {
        global.fetch = jest.fn();

        render(<Component searchTerm={searchTerm} />);
        await settle();
        screen.getByText(0);
        expect(global.fetch).not.toHaveBeenCalled();
    }

    it('does not fetch below the minimum query length', () => expectNoRequests('Am'));

    it('does not fetch for an empty search string', () => expectNoRequests(''));

    it.each([
        ['American Career College', 'Domestic'],
        ['Inter American University of Puerto Rico, Aibonito', 'Domestic'],
        ['Tarlac Agricultural University', 'Foreign'],
        ['Payakumbuh State Agricultural Polytechnic', 'Foreign']
    ])('reports %s as %s', async (name, location) => {
        render(<Component searchTerm={name} />);
        await screen.findByText(location);
    });

    it.each([
        [12345, '[12345]'],
        [0, '[0]'],
        [null, '[]'],
        [undefined, '[]']
    ])('maps an enrollment of %s to the form value %s', async (enrollment, expected) => {
        stubSfapi({
            schools: [
                {
                    name: 'Casper College',
                    type: 'College/University (4)',
                    country: 'United States',
                    total_school_enrollment: enrollment
                }
            ]
        });
        render(<Component searchTerm="Casper College" />);
        await settle();
        expect(screen.getByTestId('enrollment').textContent).toBe(expected);
    });

    it.each([
        ['a 404', {ok: false, status: 404, json: () => Promise.resolve({code: 404, detail: 'No schools found.'})}],
        ['a 429', {ok: false, status: 429, json: () => Promise.resolve({detail: 'Request was throttled.'})}]
    ])('gives an empty list, with no report and no CMS request, for %s', async (_name, response) => {
        global.fetch = jest.fn().mockResolvedValue(response);
        render(<Component searchTerm="Zzzqqx" />);
        await settle();
        screen.getByText(0);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expectNoCmsRequest(global.fetch as jest.Mock);
        expect(reportToSentry).not.toHaveBeenCalled();
        expect(reportToPostHog).not.toHaveBeenCalled();
    });

    it('gives an empty list, and reports to both tools, when the request fails', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('expected'));
        jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        render(<Component searchTerm="Casper College" />);
        await settle();
        screen.getByText(0);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expectNoCmsRequest(global.fetch as jest.Mock);
        expect(reportToSentry).toHaveBeenCalledTimes(1);
        expect(reportToPostHog).toHaveBeenCalledTimes(1);
    });

    it('reports only when sfApiFetch returns null', async () => {
        stubSfapi(null);
        render(<Component searchTerm="Casper College" />);
        await settle();
        screen.getByText(0);
        expect(reportToSentry).toHaveBeenCalledTimes(1);
        expect(reportToPostHog).toHaveBeenCalledTimes(1);
    });
});
