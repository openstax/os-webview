import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import {ArticleSummary} from '~pages/blog/blog-context';

const fields = [
    'title', 'id', 'article_image', 'featured_image_alt_text', 'heading',
    'subheading', 'body_blurb', 'date', 'author', 'article_subjects', 'collections'
].join(',');

export default function useLatestBlogEntries(limit: number) {
    const lsData = useDataFromSlug<{
        items: ArticleSummary[];
        meta: {
            total_count: number;
        }
    }>(
        `pages?type=news.newsArticle&fields=${fields}` +
        `&order=-date&pin_to_top=false&limit=${limit}`
    );

    if (!lsData) {
        return null;
    }

    const ccItems = camelCaseKeys(lsData.items) as ArticleSummary[] & {
        totalCount?: number;
    };

    ccItems.totalCount = lsData.meta.total_count;

    return ccItems;
}
