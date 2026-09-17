import React from 'react';
import {render, screen} from '@testing-library/preact';
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
    it('handles a null fetch result', () => {
        const spy = jest.spyOn(CMSF, 'default').mockResolvedValue(null);

        render(<Component searchTerm="Rice" />);
        jest.runAllTimers();
        screen.getByText(0);
        spy.mockRestore();
    });
    it('returns empty list for empty search string', async () => {
        render(<Component searchTerm="" />);
        // The fetch won't actually change the screen value
        jest.runAllTimers();
        screen.getByText(0);
    });
});
