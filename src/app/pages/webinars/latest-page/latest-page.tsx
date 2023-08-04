import React from 'react';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import SimplePaginator, {
    itemRangeOnPage,
    Showing
} from '~/components/paginator/simple-paginator';
import useWebinarContext from '../webinar-context';
import {WebinarGrid} from '../webinar-cards/latest-webinars';

const perPage = 9;

export default function LatestWebinarsPage() {
    const [page, setPage] = React.useState(1);
    const {latestWebinars} = useWebinarContext();
    const totalCount = latestWebinars.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const [first, last] = itemRangeOnPage(page, perPage, totalCount);

    return (
        <div className='latest-webinars-page boxed left'>
            <Breadcrumb name='Webinars page' />
            <WebinarHSB />
            <Showing
                page={page}
                totalCount={totalCount}
                perPage={perPage}
                ofWhat='webinars'
            />
            <WebinarGrid webinars={latestWebinars.slice(first, last)} />
            <SimplePaginator
                currentPage={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
    );
}

function WebinarHSB() {
    const {searchFor} = useWebinarContext();

    return (
        <HeadingAndSearchBar searchFor={searchFor} amongWhat='blog posts'>
            <h1>Webinars</h1>
        </HeadingAndSearchBar>
    );
}
