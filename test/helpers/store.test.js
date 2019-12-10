import {SetStore, ScalarStore} from '~/helpers/store';

describe('Scalar Store', () => {
    const s = new ScalarStore('one');

    it('creates and initializes', () => {
        expect(s.value).toBe('one');
    });

    it('changes and notifies', () => {
        let changedValue = null;

        s.on('notify', () => {
            changedValue = s.value;
        });
        s.value = 'two';
        expect(changedValue).toBe('two');
    });
});

describe('Scalar Store', () => {
    const s = new SetStore();

    it('creates with an empty set', () => {
        expect(s.value).toBeInstanceOf(Array);
        expect(s.value.length).toBe(0);
    });
    it('toggles a value', () => {
        let changedValue = null;

        s.on('notify', () => {
            changedValue = s.value;
        });
        expect(s.includes('first')).toBe(false);
        s.toggle('first');
        expect(changedValue).toEqual(['first']);
        expect(s.includes('first')).toBe(true);
        s.toggle('first');
        expect(changedValue).toEqual([]);
        s.toggle('second');
        s.toggle('third');
        expect(changedValue.length).toBe(2);
        s.clear();
        expect(changedValue).toEqual([]);
    });
});
