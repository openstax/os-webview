import SearchBox from '~/pages/separatemap/search-box/search-box';

describe('SearchBox', () => {
    const instance = new SearchBox({
        minimized: false
    });
    const isMinimized = () => instance.el.querySelectorAll('.minimized').length > 0;

    it('creates', () => {
        expect(instance).toBeTruthy();
        expect(isMinimized()).toBe(false);
    });
    it('responds to minimize', () => {
        instance.emit('update-props', {
            minimized: true
        });
        expect(isMinimized()).toBe(true);
    });
});
