import Calculator from '~/components/calculator/calculator';

describe('Calculator', () => {
    const p = new Calculator('errata');

    it('creates', () => {
        expect(p.el.innerHTML).toBeTruthy();
    });
    it('accepts values and displays a Calculate button', () => {
        expect(p.el.querySelector('.btn.calculate')).toBeNull();
        p.setValid({target: {name: 'students', value: 22}});
        p.setValid({target: {name: 'dollars', value: 12}});
        p.update();
        expect(p.el.querySelector('.btn.calculate')).toBeTruthy();
    });
    it('calculates', () => {
        expect(p.el.querySelector('.savings.block')).toBeNull();
        p.doCalculate();
        expect(p.el.querySelector('.savings.block')).toBeTruthy();
    });
});
