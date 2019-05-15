import '../../../helpers/fetch-mocker';
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

describe('ErrataDetail/ProgressBar', () => {
    it('shows dates when reviewedDate is set', () => {
        const instance = new ProgressBar({
            barStatus: 'bs',
            bars: 1,
            createdDate: 'today',
            reviewedDate: 'tomorrow',
            correctedDate: 'later'
        });
        const dates = Array.from(instance.el.querySelectorAll('.date'));

        expect(dates.length).toBe(3);
    });
    it('hides dates when reviewedDate is not set', () => {
        const instance = new ProgressBar({
            barStatus: 'bs',
            bars: 1,
            createdDate: 'today',
            reviewedDate: null,
            correctedDate: null
        });
        const dates = Array.from(instance.el.querySelectorAll('.date'));

        expect(dates.length).toBe(0);
    });
});
