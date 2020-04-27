import ErrataDetail from '~/pages/errata-detail/errata-detail.jsx';
import {makeMountRender, snapshotify} from '../../../helpers/jsx-test-utils.jsx';
import cmsFetch from '~/models/cmsFetch';

describe('ErrataDetail', () => {
    const wrapper = makeMountRender(ErrataDetail, {
        slug: '/errata/7199'
    })();

    it('matches snapshot', () => {
        expect(snapshotify(wrapper)).toMatchSnapshot();
    });
});
