import {makeMountRender, snapshotify} from '../../../helpers/jsx-test-utils.jsx';
import Buckets from '~/pages/home/buckets/buckets.jsx';
import higherEd from '../../data/buckets';

describe('Buckets', () => {
    const data = higherEd.row_3.map((x) => ('value' in x) ? x.value : x);
    const wrapper = makeMountRender(Buckets, {
        bucketModels: data
    })();

    it('matches snapshot', () => {
        expect(snapshotify(wrapper)).toMatchSnapshot();
    });
    it('creates two buckets', () => {
        expect(wrapper.find('.bucket').length).toBe(2);
    });
});
