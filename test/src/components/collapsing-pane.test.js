import CollapsingPane from '~/components/collapsing-pane/collapsing-pane';
import Child from '~/components/a-component-template/a-component-template';
import {clickElement} from '../../test-utils';

describe('CollapsingPane', () => {

    const collapsingPane = new CollapsingPane({
        title: 'First item',
        contentComponent: new Child()
    });
    const control = collapsingPane.el.querySelector('.control-bar');
    const content = collapsingPane.el.querySelector('.content-region');

    it('renders with content hidden', () => {
        expect(content.getAttribute('hidden')).toBe('');
    });

    it('toggles on click', () => {
        clickElement(control);
        expect(content.getAttribute('hidden')).toBe(null);
        clickElement(control);
        expect(content.getAttribute('hidden')).toBe('');
    });

});
