import AccordionGroup from '~/components/accordion-group/accordion-group';
import ResourceBox from '~/pages/details/resource-box/resource-box';
import {clickElement} from '../../test-utils';

describe('AccordionGroup', () => {

    const accordionGroup = new AccordionGroup({
        items: [{
            title: 'First item',
            contentComponent: new ResourceBox({})
        },
        {
            title: 'Second item',
            contentComponent: new ResourceBox({})
        }]
    });

    const itemEls = accordionGroup.el.children;
    const firstPane = itemEls[0].querySelector('.content-pane');
    const firstControl = itemEls[0].querySelector('.control-bar');
    const secondPane = itemEls[1].querySelector('.content-pane');
    const secondControl = itemEls[1].querySelector('.control-bar');

    it('renders with content hidden', () => {
        expect(firstPane.getAttribute('hidden')).toBe('');
        expect(secondPane.getAttribute('hidden')).toBe('');
    });

    it('hides one when opening the other', () => {
        clickElement(firstControl);
        expect(firstPane.getAttribute('hidden')).toBe(null);
        expect(secondPane.getAttribute('hidden')).toBe('');
        clickElement(secondControl);
        expect(firstPane.getAttribute('hidden')).toBe('');
        expect(secondPane.getAttribute('hidden')).toBe(null);
    });

    it('toggles the open one closed', () => {
        clickElement(secondControl);
        expect(firstPane.getAttribute('hidden')).toBe('');
        expect(secondPane.getAttribute('hidden')).toBe('');
    });

});
