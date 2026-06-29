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
import WebinarGrid from '../webinar-cards/webinar-grid';
import NoResults from './no-results';
import SearchControls from '../search-controls/search-controls';
import useWebinarSearchParams from '../use-webinar-search-params';

const perPage = 9;

export default function SearchPage() {
    const {searchFor} = useWebinarContext();

    return (
        <div className='search-page boxed left'>
            <Breadcrumb name='Webinars page' />
            <SearchBar searchFor={searchFor} amongWhat='webinars' />
            <SearchControls />
            <SearchResults />
        </div>
    );
}

function SearchResults() {
    const webinars = useSearchResults();
    const [page, setPage] = React.useState(1);

    if (typeof webinars === 'undefined') {
        return null;
    }
    if (webinars.length === 0) {
        return <NoResults />;
    }
    const totalCount = webinars.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const [first, last] = itemRangeOnPage(page, perPage, totalCount);

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
}

function useSearchResults() {
    const term = useCurrentSearchParameter();
    const {sort} = useWebinarSearchParams();
    const params = new URLSearchParams();

    params.set('q', term);
    if (sort === 'newest') {
        params.set('sort', 'newest');
    }

    return useFetchedData<Webinar[] | undefined>(
        {
            slug: `webinars/search?${params.toString()}`,
            resolveTo: 'json',
            camelCase: true,
            postProcess(wRaw) {
                const w = wRaw as Webinar;

                w.start = new Date(w.start);
                w.end = new Date(w.end);
                return w;
            }
        },
        undefined
    );
}
