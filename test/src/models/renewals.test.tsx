import React from 'react';
import {render} from '@testing-library/preact';
import useAdoptions from '~/models/renewals';
import * as FC from '~/helpers/page-data-utils';

describe('models/renewals', () => {
    function Component({uuid = ''}) {
        const adoptions = useAdoptions(uuid);

        return <div>{adoptions?.toString()}</div>;
    }
    it('calls fetchFromCMS when passed a uuid', () => {
        const mockFetch = jest.fn();

        jest.spyOn(FC, 'fetchFromCMS').mockImplementation(() => {
            mockFetch();
            return Promise.resolve(['hi']);
        });
        render(<Component uuid='1234' />);
        expect(mockFetch).toHaveBeenCalled();
    });
    it('does not call fetchFromCMS unless passed a uuid', () => {
        const mockFetch = jest.fn();

        jest.spyOn(FC, 'fetchFromCMS').mockImplementation(() => {
            mockFetch();
            return Promise.resolve(['hi']);
        });
        render(<Component />);
        expect(mockFetch).not.toHaveBeenCalled();
    });
});
