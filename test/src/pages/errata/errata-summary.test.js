import {ErrataSummaryLoader} from '~/pages/errata-summary/errata-summary';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import Table from '~/pages/errata-summary/table/table';

const searchStr = '/errata/?book=Anatomy%20and%20Physiology';

describe('ErrataSummary', () => {
    window.history.pushState('', '', searchStr);
    const wrapper = makeMountRender(ErrataSummaryLoader, {})();
    const getTableRows = () => wrapper.find('.summary-table tr');

    it('shows all items in table', (done) => {
        setTimeout(() => {
            wrapper.update();
            expect(getTableRows()).toHaveLength(54);
            done();
        }, 0);
    });
    // Won't be able to test filtering until it's all React :()
    it('filters', () => {
        const filters = wrapper.find('.filter-buttons .filter-button');
        const toClick = filters.at(1)

        expect(filters).toHaveLength(4);
        toClick.simulate('click');
        expect(getTableRows()).toHaveLength(19);
    });
});
