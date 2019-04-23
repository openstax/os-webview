import '../../helpers/fetch-mocker';
import AdoptionForm from '~/pages/adoption/adoption';
import instanceReady from '../../helpers/instance-ready';

describe('AdoptionForm', () => {
    const {instance:p, ready} = instanceReady(AdoptionForm);

    it('matches snapshot', () =>
        ready.then(() => {
            console.log('To update snapshot: node_modules/.bin/jest --updateSnapshot --testNamePattern=AdoptionForm');
            expect(p.el.innerHTML).toMatchSnapshot();
        })
    );
});
