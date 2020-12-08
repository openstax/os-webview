import React, {useState} from 'react';
import Filters from '~/pages/separatemap/search-box/filters/filters';
import {useSet} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

function Wrapper() {
    const selectedFilters = useSet();
    const [institution, setInstitution] = useState('');

    return (
        <Filters selected={selectedFilters} setInstitution={setInstitution} />
    );
}

describe('Filters', () => {
    const wrapper = makeMountRender(Wrapper)();

    it('creates', () => {
        const getCbs = () => wrapper.find('input[type="checkbox"]');
        const cbs = getCbs().filterWhere((cb) => !cb.checked);

        expect(cbs).toHaveLength(3);
    });
});
