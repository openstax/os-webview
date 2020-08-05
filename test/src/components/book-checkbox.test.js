import {makeMountRender} from '../../helpers/jsx-test-utils.jsx';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';

describe('BookCheckbox', () => {
    let checked = false;
    const props = {
        book: {
            value: 'book-value',
            text: 'book-text',
            coverUrl: 'book-url'
        },
        name: 'cb-name',
        checked,
        toggle() {
            checked = !checked;
        }
    };

    const wrapper = makeMountRender(BookCheckbox, props)();

    it('handles click', () => {
        expect(wrapper.find({"aria-checked": true})).toHaveLength(0);
        wrapper.find('.book-checkbox').simulate('click');
        wrapper.setProps({checked});
        expect(wrapper.find({"aria-checked": true})).toHaveLength(1);
    });
    it('handles enter keypress', () => {
        expect(checked).toBe(true);
        expect(wrapper.find({"aria-checked": true})).toHaveLength(1);
        wrapper.find('.indicator').prop('onKeyDown')({key: 'Enter', preventDefault: () => 1});
        expect(checked).toBe(false);
        wrapper.setProps({checked});
        expect(wrapper.find({"aria-checked": true})).toHaveLength(0);
    });
});
