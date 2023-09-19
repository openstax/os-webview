import React from 'react';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import SimplePaginator, {
    itemRangeOnPage,
    Showing
} from '~/components/paginator/simple-paginator';
import useWebinarContext from '../webinar-context';
import WebinarGrid from '../webinar-cards/webinar-grid';
import {Webinar} from '../types';

const perPage = 9;

export default function ViewWebinarsPage({
    heading = 'Webinars',
    webinars
}: {
    heading: string;
    webinars: Webinar[];
}) {
    const [page, setPage] = React.useState(1);
    const totalCount = webinars.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const [first, last] = itemRangeOnPage(page, perPage, totalCount);

    return (
        <div className='view-webinars-page boxed left'>
            <Breadcrumb name='Webinars page' />
            <WebinarHSB heading={heading} />
            <Showing
                page={page}
                totalCount={totalCount}
                perPage={perPage}
                ofWhat='webinars'
            />
            <WebinarGrid webinars={webinars.slice(first - 1, last)} />
            {totalPages > 1 ? (
                <SimplePaginator
                    currentPage={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            ) : null}
        </div>
    );
}

function WebinarHSB({heading}: {heading: string}) {
    const {searchFor} = useWebinarContext();

    return (
        <HeadingAndSearchBar searchFor={searchFor} amongWhat='webinars'>
            <h1>{heading}</h1>
        </HeadingAndSearchBar>
    );
}
