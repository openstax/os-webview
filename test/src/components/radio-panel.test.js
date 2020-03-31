import RadioPanel from '~/components/radio-panel/radio-panel';
import {clickElement} from '../../test-utils';
import RadioPanelJsx from '~/components/radio-panel/radio-panel.jsx';
import {makeMountRender, snapshotify} from '../../helpers/jsx-test-utils.jsx';

const items = [
    {value: '', html: 'View All'},
    {value: 'in-review', html: 'In Review'},
    {value: 'reviewed', html: 'Reviewed'},
    {value: 'corrected', html: 'Corrected'}
];

describe('RadioPanel', () => {
    let changed = false;
    const p = new RadioPanel(items);

    p.on('change', () => {
        changed = true;
    });
    it('creates', () => {
        expect(p).toBeTruthy();
    });
    it('toggles active status on click', () => {
        expect(p.el.classList.contains('active')).toBe(false);
        clickElement(p.el);
        expect(p.el.classList.contains('active')).toBe(true);
    });
});

describe('RadioPanelJsx', () => {
    let selectedValue = null;
    const updateSelected = (value) => {
        selectedValue = value;
    };
    const wrapper = makeMountRender(RadioPanelJsx, {
        items,
        selectedValue,
        updateSelected
    })();
    const buttons = () => wrapper.find('.filter-button');

    it('matches snapshot', () => {
        expect(snapshotify(wrapper)).toMatchSnapshot();
    });
    it('has a button for each item', () => {
        expect(buttons().length).toBe(items.length);
    });
    it('selects by click', () => {
        const someButton = buttons().at(3);

        expect(someButton.text()).toBe('Corrected');
        someButton.simulate('click');
        expect(selectedValue).toBe('corrected');
    });
    it ('indicates selectedValue with aria-pressed attribute', () => {
        wrapper.setProps({selectedValue: items[3].value});
        expect(buttons().at(3).prop('aria-pressed')).toBe(true);
    });
    it('selects by keydown', () => {
        buttons().at(2).simulate('keydown', {key: 'Enter'});
        expect(selectedValue).toBe('reviewed');
    });
});
