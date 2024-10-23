import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import {
    blurbModel,
    PopulatedBlurbModel
} from '../article-summary/article-summary';
import uniqBy from 'lodash/uniqBy';

type PopulatedBlurbData = Exclude<Parameters<typeof blurbModel>[0], null>;

export default function useAllArticles() {
    const {search} = useLocation();
    const searchParam = new window.URLSearchParams(search).get('q');
    const [allArticles, setAllArticles] = useState<PopulatedBlurbModel[]>([]);

    useEffect(() => {
        const slug = `search/?q=${searchParam}`;

        setAllArticles([]);
        fetchFromCMS(slug, true).then((results: PopulatedBlurbData[]) => {
            const articles = uniqBy(results, 'id').map((data) => {
                data.heading = data.title;
                data.subheading = '';
                return blurbModel(camelCaseKeys(data)) as PopulatedBlurbModel;
            });

            setAllArticles(articles);
        });
    }, [searchParam]);

    return allArticles;
}
