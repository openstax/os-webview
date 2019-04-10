import '../../helpers/fetch-mocker';
import Tutor from '~/pages/openstax-tutor/openstax-tutor';
import {clickElement} from '../../test-utils';
import instanceReady from '../../helpers/instance-ready';

describe('OpenStaxTutor', () => {
    const {instance:p, ready, waitForUpdate} = instanceReady(Tutor);

    it('matches snapshot', () => {
        ready.then(() => {
            console.log('To update snapshot: node_modules/.bin/jest --updateSnapshot --testNamePattern=OpenStaxTutor');
            expect(p.el.innerHTML).toMatchSnapshot();
        });
    });
    it('accepts thumbnail click', () => {
        const link = p.el.querySelector('.thumbnails > div:not(.active)');

        expect(Array.from(link.classList)).not.toContain('active');
        clickElement(link);
        return waitForUpdate().then(() => {
            expect(Array.from(link.classList)).toContain('active');
        });
    });
    it('has toggle-able FAQ entries', () => {
        const toggle = p.el.querySelector('.toggled-item[role="button"]');
        const hiddenAnswer = () => toggle.parentNode.querySelector('.toggled-item.hidden');

        expect(toggle).toBeTruthy();
        expect(hiddenAnswer()).toBeTruthy();
        clickElement(toggle);
        expect(hiddenAnswer()).toBeNull();
    });
});
