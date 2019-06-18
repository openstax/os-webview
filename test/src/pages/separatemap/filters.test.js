import Filters from '~/pages/separatemap/search-box/filters/filters';
import {clickElement} from '../../../test-utils';

describe('Filters', () => {
    const instance = new Filters();

    it('creates', () => {
        expect(instance).toBeTruthy();
    });
    it('sets values by checkbox', () => {
        const getUncheckedCbs = () => Array
            .from(instance.el.querySelectorAll('input[type="checkbox"]'))
            .filter((cb) => !cb.checked);
        const cbs = getUncheckedCbs();

        expect(cbs.length).toBe(3);
        cbs.forEach((cb) => {
            cb.checked = true;
        });
        expect(getUncheckedCbs().length).toBe(0);

        cbs.forEach((cb) => {
            cb.checked = true;
            instance.handleChange({delegateTarget: cb});
            expect(instance.filters[cb.name]).toBe(true);
        });
    });

    it('sets institution value by select', () => {
        instance.select.emit('change', 'whatever');
        expect(instance.filters['institution-type']).toBe('whatever');
        instance.select.emit('change', null);
        expect(instance.filters).not.toHaveProperty('institution-type');
    })
});
