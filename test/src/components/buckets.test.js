import Buckets from '~/pages/home/buckets/buckets';
import higherEd from '../data/buckets';

describe('Buckets', () => {
    const data = higherEd.row_3.map((x) => ('value' in x) ? x.value : x);
    const p = new Buckets(data);
    const buckets = Array.from(p.el.querySelectorAll('.bucket'));

    it('creates two buckets', () => {
        expect(buckets.length).toBe(2);
    });
});
