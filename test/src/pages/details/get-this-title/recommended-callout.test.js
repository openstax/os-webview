import RecommendedCallout from '~/pages/details/common/get-this-title-files/recommended-callout/recommended-callout';
import {makeMountRender} from '../../../../helpers/jsx-test-utils.jsx';

describe('recommended-callout', () => {
    it('defaults to "Recommended" and no blurb', () => {
        const wrapper = makeMountRender(RecommendedCallout)();

        expect(wrapper.find('.callout-title').text()).toBe('Recommended');
        expect(wrapper.find('.callout-blurb')).toHaveLength(0);
    });
    it('displays custom title', () => {
        const wrapper = makeMountRender(RecommendedCallout, {
            title: 'custom title'
        })();

        expect(wrapper.find('.callout-title').text()).toBe('custom title');
    });
    it('displays custom blurb', () => {
        const blurbHtml = '<b>some text</b>';
        const wrapper = makeMountRender(RecommendedCallout, {
            blurb: blurbHtml
        })();
        const blurbs = wrapper.find('.callout-blurb');

        // For some reason, we find two blurbs. There should be only one.
        // HTML for the wrapper only shows one.
        expect(blurbs.at(0).getDOMNode().innerHTML).toBe(blurbHtml);
    })
});
