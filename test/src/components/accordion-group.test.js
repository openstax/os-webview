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

    const itemEls = accordionGroup.el.querySelectorAll('.accordion-item');
    const firstPane = itemEls[0].querySelector('.content-pane');
    const secondPane = itemEls[1].querySelector('.content-pane');

    it('renders with content hidden', () => {
        expect(firstPane.hasAttribute('hidden')).toBe(true);
        expect(secondPane.hasAttribute('hidden')).toBe(true);
    });
});
