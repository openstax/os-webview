import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import {AdoptionForm} from '~/pages/adoption/adoption';

describe('AdoptionForm', () => {
    let wrapper;

    beforeEach((done) => {
        wrapper = makeMountRender(AdoptionForm, {})();

        setTimeout(() => {
            wrapper.update();
            done();
        }, 10);
    });

    it('creates with role selector', () => {
        expect(wrapper.find('.role-selector')).toHaveLength(1);
        expect(wrapper.find('.multi-page-form')).toHaveLength(0);
    });
    it('loads faculty form', () => {
        wrapper.find('.select').simulate('click');
        wrapper.find('li.option').at(3).simulate('click');
        expect(wrapper.find('.multi-page-form')).toHaveLength(1);
    });
});
