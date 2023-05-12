import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';

const fields = [
    'title', 'id', 'article_image', 'featured_image_alt_text', 'heading',
    'subheading', 'body_blurb', 'date', 'author', 'article_subjects', 'collections'
].join(',');

export default function useLatestBlogEntries(limit) {
    const lsData = useDataFromSlug(
        `pages?type=news.newsArticle&fields=${fields}` +
        `&order=-date&pin_to_top=false&limit=${limit}`
    );

    if (!lsData) {
        return null;
    }

    const ccItems = camelCaseKeys(lsData.items);

    ccItems.totalCount = lsData.meta.total_count;

    return ccItems;
}
