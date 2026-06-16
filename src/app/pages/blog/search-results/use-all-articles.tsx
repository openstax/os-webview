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

function buildSlug({q, subjects, collection, sort}: {
    q?: string; subjects: string[]; collection?: string; sort: string;
}) {
    const p = new window.URLSearchParams();

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
    return `search/?${p.toString()}`;
}

export default function useAllArticles() {
    const {q, subjects, collection, sort} = useBlogSearchParams();
    const [allArticles, setAllArticles] = useState<PopulatedBlurbModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const slug = buildSlug({q, subjects, collection, sort});

    useEffect(() => {
        let cancelled = false;

        // Keep the previous results on screen while refetching so changing a
        // facet doesn't flash the empty/no-results view (the flicker).
        setIsLoading(true);
        fetchFromCMS(slug, true).then((results: PopulatedBlurbData[]) => {
            if (cancelled) {
                return;
            }
            const articles = uniqBy(results, 'id').map((data) => {
                data.heading = data.title;
                data.subheading = '';
                return blurbModel(camelCaseKeys(data) as BlurbData) as PopulatedBlurbModel;
            });

            setAllArticles(articles);
            setIsLoading(false);
        }).catch(() => {
            // A failed search shouldn't leave the page stuck in its loading
            // state (aria-busy + "Searching" forever); fall through to the
            // no-results view instead.
            if (cancelled) {
                return;
            }
            setAllArticles([]);
            setIsLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    return {articles: allArticles, isLoading};
}
