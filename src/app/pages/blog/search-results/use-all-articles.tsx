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
    const slug = buildSlug({q, subjects, collection, sort});

    useEffect(() => {
        setAllArticles([]);
        fetchFromCMS(slug, true).then((results: PopulatedBlurbData[]) => {
            const articles = uniqBy(results, 'id').map((data) => {
                data.heading = data.title;
                data.subheading = '';
                return blurbModel(camelCaseKeys(data) as BlurbData) as PopulatedBlurbModel;
            });

            setAllArticles(articles);
        });
    }, [slug]);

    return allArticles;
}
