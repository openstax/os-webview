import GetThisTitle from '~/pages/details/common/get-this-title';
import {makeMountRender} from '../../../../helpers/jsx-test-utils.jsx';
import shellBus from '~/components/shell/shell-bus';
// College algebra book details
import details from '../../../data/details';
import {transformData} from '~/helpers/controller/cms-mixin';
import $ from '~/helpers/$';

describe('GetThisTitle', () => {
    const model = $.camelCaseKeys(transformData(details));

    const wrapper = makeMountRender(GetThisTitle, {
        model: model,
        tocState: false
    })();

    it('handles Print Copy dialog', () => {
        const options = wrapper.find('.option');
        const showed = new Promise((resolve) => {
            shellBus.on('showDialog', resolve);
        });

        expect(options).toHaveLength(5);
        options.forEach((opt) => {
            if (opt.text() === 'Order a print copy') {
                opt.find('a').simulate('click');
            }
        });
        return showed;
    });
    it('handles hiding and expanding non-preferred formats', () => {
        const expandLink = () => wrapper.find('.option.expander a');
        const optionLinks = () => wrapper.find('.option a');

        expect(expandLink()).toHaveLength(1);
        expect(optionLinks()).toHaveLength(5);
        expandLink().simulate('click');
        expect(optionLinks()).toHaveLength(6);
        expandLink().simulate('click');
        expect(optionLinks()).toHaveLength(5);
    });
    it('respects enable_study_edge flag', () => {
        const modelWithStudyEdge = Object.assign({}, model, {enableStudyEdge: true});
        const seWrapper = makeMountRender(GetThisTitle, {
            model: modelWithStudyEdge,
            tocState: false
        })();
        const findStudyEdgeOption = (w) =>
            w.find('.option').filterWhere((opt) => opt.text() === 'Download the app');

        expect(findStudyEdgeOption(wrapper)).toHaveLength(0);
        expect(findStudyEdgeOption(seWrapper)).toHaveLength(1);
    });
    it('does the callout for Rex book', () => {
        const callout = wrapper.find('.callout');

        expect(callout).toHaveLength(1);
        expect(callout.text()).toMatch('Recommended');
    });
});
