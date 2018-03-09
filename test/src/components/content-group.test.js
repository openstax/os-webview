import ContentGroup from '~/components/content-group/content-group';
import ResourceBox from '~/pages/details-new/resource-box/resource-box';

describe('ContentGroup', () => {
    const contents = {
        'First pane': new ResourceBox({}),
        'Second pane': new ResourceBox({}),
        'Third pane': new ResourceBox({})
    };
    let selectedTab = Object.keys(contents)[0];

    const contentGroup = new ContentGroup(() => ({
        selectedTab,
        contents
    }));
    const panes = Array.from(contentGroup.el.children);

    it('renders with all but selectedTab hidden', () => {
        expect(panes[0].getAttribute('hidden')).toBe(null);
        expect(panes[1].getAttribute('hidden')).toBe('');
        expect(panes[2].getAttribute('hidden')).toBe('');
    });

    it('changes to selected tab', () => {
        selectedTab = Object.keys(contents)[1];
        contentGroup.update();
        expect(panes[0].getAttribute('hidden')).toBe('');
        expect(panes[1].getAttribute('hidden')).toBe(null);
        expect(panes[2].getAttribute('hidden')).toBe('');
    });

});
