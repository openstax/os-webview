import React from 'react';
import {act, render, screen} from '@testing-library/preact';
import useMatchingSchools from '~/models/use-school-suggestion-list';
import * as CMSF from '~/helpers/cms-fetch';


describe('models/use-school-suggestion-list', () => {
    function Component({searchTerm = ''}) {
        const {schoolNames} = useMatchingSchools(searchTerm);

        return (
            <div>
                <div>{schoolNames.length}</div>
            </div>
        );
    }
    jest.useFakeTimers();
    it('fetches schools', async () => {
        render(<Component searchTerm="Casper College" />);
        await screen.findByText(40);
    });
    it('handles a null fetch result', async () => {
        const {rerender} = render(<Component searchTerm="Casper College" />);

        await screen.findByText(40);
        const spy = jest.spyOn(CMSF, 'default').mockResolvedValue(null);

        try {
            rerender(<Component searchTerm="Rice" />);
            await act(async () => {
                jest.runAllTimers();
            });
            expect(spy).toHaveBeenCalledWith('salesforce/schools?search=Rice');
            await screen.findByText(0);
        } finally {
            spy.mockRestore();
        }
    });
    it('returns empty list for empty search string', async () => {
        render(<Component searchTerm="" />);
        // The fetch won't actually change the screen value
        jest.runAllTimers();
        screen.getByText(0);
    });
});
