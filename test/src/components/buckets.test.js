import Buckets from '~/components/buckets/buckets';
import higherEd from '../data/buckets';

describe('Buckets', () => {
    const data = higherEd.row_3.map((x) => ('value' in x) ? x.value : x);
    const p = new Buckets(data);
    const buckets = Array.from(p.el.querySelectorAll('.bucket'));

    it('creates two buckets', () => {
        expect(buckets.length).toBe(2);
    });
    it('assigns titles and blurbs', () => {
        expect(buckets[0].querySelector('.title').textContent).toBe(data[0].heading);
        expect(buckets[0].querySelector('.blurb').innerHTML).toBe(data[0].content);
        expect(buckets[1].querySelector('.title').textContent).toBe(data[1].heading);
        expect(buckets[1].querySelector('.blurb').innerHTML).toBe(data[1].content);
    });
    it('assigns links', () => {
        expect(buckets[0].querySelector('a.btn').href).toBe(data[0].link);
        expect(buckets[0].querySelector('a.btn').href).toBe(data[0].link);
        expect(buckets[1].querySelector('a.btn').textContent).toBe(data[1].cta);
        expect(buckets[1].querySelector('a.btn').textContent).toBe(data[1].cta);
    });
});
