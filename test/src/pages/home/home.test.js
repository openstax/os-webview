import Home from '~/pages/home/home';
import instanceReady from '../../../helpers/instance-ready';

describe('homepage', () => {
    const {instance, ready} = instanceReady(Home);

    // Can't use ready because it waits for images
    it('creates', () => {
        expect(instance).toBeTruthy();
    });
});
