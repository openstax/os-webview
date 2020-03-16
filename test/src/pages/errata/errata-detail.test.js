import ErrataDetail from '~/pages/errata-detail/errata-detail';
import ProgressBar from '~/pages/errata-detail/progress-bar/progress-bar';
import instanceReady from '../../../helpers/instance-ready';

describe('ErrataDetail', () => {
    it('creates', () => {
        window.history.pushState('', '', '/errata/7199');
        const {instance, ready} = instanceReady(ErrataDetail);
        const children = () => instance.el.querySelector('.boxed');

        expect(children().innerHTML).toBe('');
        return ready.then(() => {
            expect(children().children.length).toBe(2);
        });
    });
});
