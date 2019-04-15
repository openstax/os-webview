import '../../../helpers/fetch-mocker';
import Tutor from '~/pages/openstax-tutor/openstax-tutor';
import {clickElement} from '../../../test-utils';
import instanceReady from '../../../helpers/instance-ready';

describe('OpenStaxTutor', () => {
    const {instance:p, ready} = instanceReady(Tutor);

    it('matches snapshot', () => {
        return ready.then(() => {
            console.log('To update snapshot: node_modules/.bin/jest --updateSnapshot --testNamePattern=OpenStaxTutor');
            expect(p.el.innerHTML).toMatchSnapshot();
        });
    });
    it('has toggle-able FAQ entries', () => {
        return ready.then(() => {
            const toggle = p.el.querySelector('.toggled-item[role="button"]');
            const hiddenAnswer = () => toggle.parentNode.querySelector('.toggled-item.hidden');

            expect(toggle).toBeTruthy();
            expect(hiddenAnswer()).toBeTruthy();
            clickElement(toggle);
            expect(hiddenAnswer()).toBeNull();
        });
    });
});
