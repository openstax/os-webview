import cms from '~/helpers/cms';

const newsPromise = cms.query({
    type: 'news.NewsArticle',
    fields: ['slug', 'title', 'date', 'author', 'pin_to_top', 'subheading', 'body', 'article_image']
});

export default newsPromise;
