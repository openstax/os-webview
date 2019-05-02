import '../../../helpers/fetch-mocker';
import Errata from '~/pages/errata/errata';
import instanceReady from '../../../helpers/instance-ready';

describe('Errata', () => {
    it('creates for specific errata number', () => {
        window.history.pushState({}, 'errata', `/errata/7199`);
        const {instance, ready} = instanceReady(Errata);

        return ready.then(() => {
            console.info('HTML', instance.el.innerHTML);
        });
    });
    it('lists errata for book', () => {
        window.history.pushState({}, 'errata', `/errata/?book=Elementary%20Algebra`);
        const {instance, ready} = instanceReady(Errata);

        return ready.then(() => {
            console.info('HTML', instance.el.innerHTML);
        });
    });
    it('displays the errata form', () => {
        window.history.pushState({}, 'errata', `/errata/form?book=Elementary%20Algebra`);
        const {instance, ready} = instanceReady(Errata);

        return ready.then(() => {
            console.info('HTML', instance.el.innerHTML);
        });

    });
});
