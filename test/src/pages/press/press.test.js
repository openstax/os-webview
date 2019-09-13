import Press from '~/pages/press/press';
import instanceReady from '../../../helpers/instance-ready';

beforeEach(() => {
    window.history.pushState({}, 'press', '/press');
});

describe('Press', () => {
    it('recognizes article from path', () => {
        const slugInUrl = '/press/openstax-publishes-new-business-textbook-series';
        const strippedLeadingDash = slugInUrl.substr(1);
        window.history.pushState({}, 'press', slugInUrl);
        const {instance, ready} = instanceReady(Press);

        return ready.then(() => {
            expect(instance.articleSlug).toBe(strippedLeadingDash);
            const heroDiv = instance.el.querySelector('.hero');
            const articleDiv = instance.el.querySelector('.article.page');

            expect(heroDiv).toBeFalsy();
            expect(articleDiv).toBeTruthy();
        });
    });
    it('recognizes main press page path', () =>{
        const {instance, ready} = instanceReady(Press);

        return ready.then(() => {
            const heroDiv = instance.el.querySelector('.hero');
            const articleDiv = instance.el.querySelector('.article.page');

            expect(heroDiv).toBeTruthy();
            expect(articleDiv).toBeFalsy();
        })
    });
});
