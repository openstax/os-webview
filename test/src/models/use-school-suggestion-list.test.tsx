import React from 'react';
import {render, screen} from '@testing-library/preact';
import useMatchingSchools from '~/models/use-school-suggestion-list';

describe('models/use-school-suggestion-list', () => {
    const saveFetch = global.fetch;

    function Component({searchTerm = ''}) {
        const {schoolNames, selectedSchool} = useMatchingSchools(searchTerm);

        return (
            <div>
                <div data-testid="count">{schoolNames.length}</div>
                <div data-testid="location">
                    {selectedSchool ? selectedSchool.location : ''}
                </div>
            </div>
        );
    }

    jest.useFakeTimers();

    afterEach(() => {
        global.fetch = saveFetch;
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

    it('treats a not-found response as no matches', async () => {
        global.fetch = jest.fn().mockResolvedValue({ok: false});
        render(<Component searchTerm="Zzzqqx" />);
        jest.runAllTimers();
        await screen.findByText(0);
        expect(global.fetch).toHaveBeenCalled();
    });

    it('treats a failed request as no matches', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('expected'));
        render(<Component searchTerm="American" />);
        jest.runAllTimers();
        await screen.findByText(0);
        expect(global.fetch).toHaveBeenCalled();
    });
});
