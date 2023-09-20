import React from 'react';
import SimplePaginator, {
    itemRangeOnPage,
    Showing
} from '~/components/paginator/simple-paginator';
import WebinarGrid from './webinar-grid';
import {Webinar} from '../types';
import './paginated-webinar-grid.scss';

const perPage = 9;

export default function PaginatedWebinarGrid({
    webinars
}: {
    webinars: Webinar[];
}) {
    const [page, setPage] = React.useState(1);
    const totalCount = webinars.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const [first, last] = itemRangeOnPage(page, perPage, totalCount);

    return (
        <div className="paginated-webinar-grid">
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
