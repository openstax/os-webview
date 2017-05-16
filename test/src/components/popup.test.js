import Popup from '~/components/popup/popup';

describe('Popup', () => {
    const mainEl = document.createElement('div');
    mainEl.id = 'main';
    document.body.appendChild(mainEl);
    const p = new Popup('hi there');

    it('creates', () => {
        expect(p).toBeTruthy();
    });
});
