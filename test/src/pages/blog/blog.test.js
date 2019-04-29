import '../../../helpers/fetch-mocker';
import Blog from '~/pages/blog/blog';
import instanceReady from '../../../helpers/instance-ready';

describe('blog', () => {
    const {instance: p, ready} = instanceReady(Blog);

    it('loads articles', () =>
        ready.then(() => {
            expect(p).toBeTruthy();
            expect(Reflect.ownKeys(p.articles).length).toBe(93);
        })
    );
});
