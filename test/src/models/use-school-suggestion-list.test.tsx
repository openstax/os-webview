import React from 'react';
import {render, screen} from '@testing-library/preact';
import useMatchingSchools from '~/models/use-school-suggestion-list';
import * as USDC from '~/contexts/shared-data';
import * as SFF from '~/models/sfapi';


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
    it('returns empty list for empty search string', async () => {
        render(<Component searchTerm="" />);
        // The fetch won't actually change the screen value
        jest.runAllTimers();
        screen.getByText(0);
    });
    it('works via sfApiFetch, too', () => {
        jest.spyOn(USDC, 'default').mockReturnValue({
            flags: {my_openstax: true} // eslint-disable-line camelcase
        } as ReturnType<typeof USDC.default>);
        jest.spyOn(SFF, 'default').mockResolvedValue([]);
        render(<Component searchTerm="Rice" />);
        jest.runAllTimers();
        screen.getByText(0);
    });
});
