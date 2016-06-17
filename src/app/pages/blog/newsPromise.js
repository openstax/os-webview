import PageModel from '~/models/pagemodel';

let newsPromise = new PageModel().fetch({
    data: {
        type: 'news.NewsArticle',
        fields: ['slug', 'title', 'date', 'author', 'pin_to_top', 'subheading', 'body', 'article_image']
    }
});

export default newsPromise;
