import SearchBox from '~/pages/separatemap/search-box/search-box';

describe('SearchBox', () => {
    const instance = new SearchBox();

    it('creates', () => {
        expect(instance).toBeTruthy();
        console.info(instance.el.innerHTML);
    });
});
