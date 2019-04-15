import '../../helpers/fetch-mocker';
import Research from '~/pages/research/research';

describe('Research Alumni Tab', () => {
    const p = new Research();

    it('creates', () => {
        expect(p).toBeTruthy();
        const h1 = () => p.el.querySelector('.hero h1');

        expect(h1()).toBeNull();
        p.pageData = {
          title: 'Research',
          mission_header: 'Research Mission',
          mission_body: 'Some text for the mission body',
          projects: [],
          publications: []
        };
        p.update();
        expect(h1().textContent).toBe(p.pageData.mission_header);
    });
});
