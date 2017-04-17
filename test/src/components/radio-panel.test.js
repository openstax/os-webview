import RadioPanel from '~/components/radio-panel/radio-panel';

describe('RadioPanel', () => {
    let changed = false;
    const p = new RadioPanel([
        {value: '', html: 'View All'},
        {value: 'in-review', html: 'In Review'},
        {value: 'reviewed', html: 'Reviewed'},
        {value: 'corrected', html: 'Corrected'}
    ], () => {
        changed = true;
    });

    it('creates', () => {
        expect(p).toBeTruthy();
        console.log(p.el.innerHTML);
    });

    it('changes values', () => {
        const target = p.el.querySelector('.filter-button[data-value="in-review"]');

        expect(target).toBeTruthy();
        expect(p.selectedValue).toBeUndefined();
        p.setCategory({target});
        expect(p.selectedValue).toBe(target.getAttribute('data-value'));
    });
});
