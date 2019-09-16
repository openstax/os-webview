import Home from '~/pages/home/home';
import instanceReady from '../../../helpers/instance-ready';

describe('homepage', () => {
    const {instance, ready} = instanceReady(Home);

    it('creates', () =>
        ready.then(() => {
            expect(instance).toBeTruthy();
        })
    );
});
