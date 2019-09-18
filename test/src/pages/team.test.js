import '../../helpers/fetch-mocker';
import Team from '~/pages/team/team';
import {clickElement} from '../../test-utils';

describe('Team Page', () => {
    const p = new Team();

    it('creates', () => {
        expect(p).toBeTruthy();
    });
    it('has team tab selected', () => {
        const selectedTab = p.el.querySelector('.tab-group .tab[aria-current="page"]');
        const selectedContent = p.el.querySelector('.content-group > .people-tab:not([hidden])');
        const cardsOnSelectedContent = Array.from(selectedContent.querySelectorAll('.card')).length;
        const headings = p.pageData.openstax_people.map((obj) => obj.heading);

        expect(selectedTab.textContent).toBe(headings[0]);
        expect(cardsOnSelectedContent).toBe(61);
    });
});
