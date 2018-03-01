import CollapsingPane from '~/components/collapsing-pane/collapsing-pane';
import ResourceBox from '~/pages/details-new/resource-box/resource-box';
import {clickElement} from '../../test-utils';

describe('CollapsingPane', () => {

    const collapsingPane = new CollapsingPane({
        title: 'First item',
        contentComponent: new ResourceBox({})
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
