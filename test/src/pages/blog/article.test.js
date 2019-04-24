import '../../../helpers/fetch-mocker';
import Article from '~/pages/blog/article/article';
import instanceReady from '../../../helpers/instance-ready';

const article =  {
    slug: 'blog-article',
    date: '2016-07-13',
    author: 'David Ruth, Rice News',
    article_image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Screen_Shot_2016-12-07_at_2.31.47_PM.png',
    pin_to_top: false,
    tags: [ 'OpenStax', 'OER', 'RiceUniversity' ],
    heading: 'OpenStax, Rice Online Learning offer suite of free resources',
    subheading: 'Rice organizations offer professional-quality resources for AP® physics courses',
    detail_url: '/api/v2/pages/107'
};

describe('blog/article', () => {
    it('loads as page', () => {
        const {instance, ready} = instanceReady(Article, article, 'page');

        return ready.then(() => {
            return instance.populateArticleData().then(() => {
                expect(instance.el.textContent.length).toBe(5229);
            });
        });
    });
    it('loads as not-a-page', () => {
        const {instance, ready} = instanceReady(Article, article);

        return ready.then(() => {
            return instance.populateArticleData().then(() => {
                expect(instance.el.textContent.length).toBe(620);
            });
        });
    });
});
