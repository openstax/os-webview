import CustomizationForm from '~/pages/details/common/customization-form/customization-form';
import rawData from '../../data/details-biology-2e';
import {transformData} from '~/helpers/controller/cms-mixin';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

const data = transformData(rawData);

describe('Customization form', () => {
    const wrapper = makeMountRender(CustomizationForm, {model: data})();

    it('shows the form', () => {
        expect(wrapper.find('form')).toHaveLength(1);
    });
});
