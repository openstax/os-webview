import React from 'react';
import {Webinar} from '../types';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import SearchBar from '~/components/search-bar/search-bar';
import useWebinarContext from '../webinar-context';
import {useCurrentSearchParameter} from '~/components/search-bar/search-context';
import useFetchedData from '~/helpers/use-data';
import SimplePaginator, {
    itemRangeOnPage,
    Showing
} from '~/components/paginator/simple-paginator';
import {WebinarGrid} from '../webinar-cards/latest-webinars';

const perPage = 9;

export default function SearchPage() {
    const {searchFor} = useWebinarContext();
    const webinars = useSearchResults();
    const [page, setPage] = React.useState(1);

    if (typeof webinars === 'undefined') {
        return null;
    }
    const totalCount = webinars.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const [first, last] = itemRangeOnPage(page, perPage, totalCount);

    return (
        <div className='search-page boxed left'>
            <Breadcrumb name='Webinars page' />
            <SearchBar searchFor={searchFor} amongWhat='webinars' />
            <Showing
                page={page}
                totalCount={totalCount}
                perPage={perPage}
                ofWhat='matching webinars'
            />
            <WebinarGrid webinars={webinars.slice(first - 1, last)} />
            <SimplePaginator
                currentPage={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
    );
}

function useSearchResults() {
    const term = useCurrentSearchParameter();

    return useFetchedData<Webinar[] | undefined>(
        {
            slug: `webinars/search?q=${encodeURIComponent(term)}`,
            resolveTo: 'json',
            camelCase: true,
            postProcess: (w) => {
                w.start = new Date(w.start);
                w.end = new Date(w.end);
                return w;
            }
        },
        undefined
    );
}
