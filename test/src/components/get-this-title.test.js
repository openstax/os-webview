jest.mock('~/helpers/analytics');
import GetThisTitle from '~/components/get-this-title/get-this-title';
import details from '../data/details';

describe('GetThisTitle', () => {
    const p = new GetThisTitle(details);

    it('initializes', () => {
        expect(p).toBeTruthy();
        console.log(p.el.innerHTML);
    });
});
