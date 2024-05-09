import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {fetchFromCMS, camelCaseKeys} from '~/helpers/page-data-utils';
import {blurbModel} from '../article-summary/article-summary';
import uniqBy from 'lodash/uniqBy';

export default function useAllArticles() {
    const {search} = useLocation();
    const searchParam = new window.URLSearchParams(search).get('q');
    const [allArticles, setAllArticles] = useState([]);

    useEffect(() => {
        const slug = `search/?q=${searchParam}`;

        setAllArticles([]);
        fetchFromCMS(slug, true).then((results) => {
            setAllArticles(
                uniqBy(results, 'id').map((data) => {
                    data.heading = data.title;
                    delete data.subheading;
                    return blurbModel(camelCaseKeys(data));
                })
            );
        });
    }, [searchParam]);

    return allArticles;
}
