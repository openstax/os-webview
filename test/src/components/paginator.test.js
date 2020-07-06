import {makeMountRender, snapshotify} from '../../helpers/jsx-test-utils.jsx';
import {PaginatedResults, PaginatorControls} from '~/components/paginator/paginator.jsx';

describe('PaginatorControls', () => {
    let page = 2;
    const wrapper = makeMountRender(PaginatorControls, {
        items: 33,
        currentPage: page,
        setCurrentPage(newPage) {
            page = newPage;
        }
    })();

    it('operates by button clicks', () => {
        expect(snapshotify(wrapper)).toMatchSnapshot();
        const getButtons = () => wrapper.find('button');
        const nextPageButton = getButtons().last();

        expect(nextPageButton.text()).toBe('Next');
        nextPageButton.simulate('click');
        expect(page).toBe(3);
        getButtons().first().simulate('click');
        expect(page).toBe(1);
        getButtons().at(2).simulate('click');
        expect(page).toBe(2);
    });
});
