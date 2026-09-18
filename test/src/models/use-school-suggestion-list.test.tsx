import React from 'react';
import {render, screen} from '@testing-library/preact';
import useMatchingSchools from '~/models/use-school-suggestion-list';
import * as CMSF from '~/helpers/cms-fetch';

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

    jest.useFakeTimers();

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
    });

    it.each(['reject' as const, 500])(
        'falls back to the CMS when sfapi answers %s',
        async (reason) => {
            breakSfapi(reason);
            render(<Component searchTerm="Casper College" />);
            await screen.findByText(40);
        }
    );

    it('gives up when the CMS fails too', async () => {
        breakSfapi('reject');
        jest.spyOn(CMSF, 'default').mockRejectedValue(new Error('expected'));
        render(<Component searchTerm="Casper College" />);
        jest.runAllTimers();
        await screen.findByText(0);
    });
});
