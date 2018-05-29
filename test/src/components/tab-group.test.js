import TabGroup from '~/components/tab-group/tab-group';
import {clickElement} from '../../test-utils';

describe('TabGroup', () => {
    const labels = [
        'First pane',
        'Second pane',
        'Third pane'
    ];
    let selectedTab = labels[0];

    const tabGroup = new TabGroup(() => ({
        selectedTab,
        tabLabels: labels,
        setSelected(newValue) {
            selectedTab = newValue;
        }
    }));
    const tabs = tabGroup.el.querySelectorAll('.tab');

    it('renders with first tab selected', () => {
        expect(tabs[0].getAttribute('aria-current')).toBe('page');
        expect(tabs[1].getAttribute('aria-current')).toBeNull();
        expect(tabs[2].getAttribute('aria-current')).toBeNull();
    });

    it('changes to clicked tab', () => {
        clickElement(tabs[2]);
        expect(tabs[0].getAttribute('aria-current')).toBeNull();
        expect(tabs[1].getAttribute('aria-current')).toBeNull();
        expect(tabs[2].getAttribute('aria-current')).toBe('page');
    });

    it('properly labels tabs', () => {
        const mismatch = labels.find((v, i) => v !== tabs[i].textContent);

        expect(mismatch).toBeUndefined();
    });

});
