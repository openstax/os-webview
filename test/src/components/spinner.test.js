import Spinner from '~/components/spinner/spinner';

describe('Spinner', () => {
    const p = new Spinner({value: 10});

    it('creates', () => {
        expect(p).toBeTruthy();
    });

    it('increments and decrements', () => {
        p.increment();
        expect(p.model.value).toBe(11);
        p.decrement();
        expect(p.model.value).toBe(10);
    });

    it('recognizes value changes', () => {
        const el = p.el.querySelector('[type="number"]');

        expect(el).toBeTruthy();
        el.value = 5;
        p.updateItem({target: el});
        expect(p.model.value).toBe(5);
    });
});
