import React, {useState} from 'react';
import {render, screen} from '@testing-library/preact';
import Filters from '~/pages/separatemap/search-box/filters/filters';
import {useSet} from '~/helpers/data';

// I need the hooks
function WrappedFilters() {
    const selectedFilters = useSet();
    const [institution, setInstitution] = useState('');

    return (
        <Filters selected={selectedFilters} setInstitution={setInstitution} />
    );
}
it('creates', () => {
    render(<WrappedFilters />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
});
