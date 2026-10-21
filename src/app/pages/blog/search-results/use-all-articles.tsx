import {useState, useEffect} from 'react';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import {
    blurbModel,
    PopulatedBlurbModel,
    BlurbData
} from '../article-summary/article-summary';
import useBlogSearchParams from '../use-blog-search-params';
import uniqBy from 'lodash/uniqBy';

type PopulatedBlurbData = Exclude<Parameters<typeof blurbModel>[0], null>;

// The `news` source page from search/v2/; results are the same raw item
// shape the old bare-array endpoint returned (see PopulatedBlurbData above).
type SearchV2Response = {
    sources: {
        news: {
            total: number;
            results: PopulatedBlurbData[];
        };
    };
};

function buildSlug({q, subjects, collection, sort, page, pageSize}: {
    q?: string; subjects: string[]; collection?: string; sort: string;
    page: number; pageSize: number;
}) {
    const p = new window.URLSearchParams();

    p.set('sources', 'news');
    if (q) {
        p.set('q', q);
    }
    if (subjects.length) {
        p.set('subjects', subjects.join(','));
    }
    if (collection) {
        p.set('collection', collection);
    }
    if (sort === 'newest') {
        p.set('sort', 'newest');
    }
    p.set('page', String(page));
    p.set('page_size', String(pageSize));
    return `search/v2/?${p.toString()}`;
}

export default function useAllArticles(page: number, pageSize: number) {
    const {q, subjects, collection, sort} = useBlogSearchParams();
    const [allArticles, setAllArticles] = useState<PopulatedBlurbModel[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const slug = buildSlug({q, subjects, collection, sort, page, pageSize});

    useEffect(() => {
        let cancelled = false;

        // Keep the previous results on screen while refetching so changing a
        // facet doesn't flash the empty/no-results view (the flicker).
        setIsLoading(true);
        fetchFromCMS(slug, true).then((response: SearchV2Response) => {
            if (cancelled) {
                return;
            }
            const {results, total: newTotal} = response.sources.news;
            const articles = uniqBy(results, 'id').map((data) => {
                data.heading = data.title;
                data.subheading = '';
                return blurbModel(camelCaseKeys(data) as BlurbData) as PopulatedBlurbModel;
            });

            setAllArticles(articles);
            setTotal(newTotal);
            setIsLoading(false);
        }).catch(() => {
            // A failed search shouldn't leave the page stuck in its loading
            // state (aria-busy + "Searching" forever); fall through to the
            // no-results view instead.
            if (cancelled) {
                return;
            }
            setAllArticles([]);
            setTotal(0);
            setIsLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    return {articles: allArticles, isLoading, total};
}
