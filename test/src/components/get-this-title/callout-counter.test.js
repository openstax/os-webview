import calloutCounter from '~/components/get-this-title/callout-counter';

describe('calloutCounter', () => {
    it('throws an error if no slug set', () => {
        expect(() => calloutCounter.count).toThrow('slug');
    });
    it('initializes on a slug', () => {
        calloutCounter.setSlug('first-slug');
        expect(() => calloutCounter.count).not.toThrow('slug');
        expect(calloutCounter.count).toBe(0);
    });
    it('increments once', () => {
        calloutCounter.increment();
        expect(calloutCounter.count).toBe(1);
        calloutCounter.increment();
        expect(calloutCounter.count).toBe(1);
    });
    it('increments again after slug change', () => {
        calloutCounter.setSlug('second-slug');
        expect(calloutCounter.count).toBe(0);
        calloutCounter.setSlug('first-slug');
        expect(calloutCounter.count).toBe(1);
        calloutCounter.increment();
        expect(calloutCounter.count).toBe(2);
    });
    it('allows count to be set', () => {
        calloutCounter.count = 100;
        expect(calloutCounter.count).toBe(100);
    });
});
