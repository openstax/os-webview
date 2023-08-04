import React from 'react';
import {LatestBlurbs} from '../more-stories/more-stories';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import SimplePaginator from '~/components/paginator/simple-paginator';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import useBlogContext from '../blog-context';
import './latest-blog-posts.scss';

const perPage = 9;

function Showing({page}) {
    const {totalCount} = useBlogContext();
    const end = Math.min(totalCount, page * perPage);
    const start = end - perPage + 1;

    return (
        <div className="whats-showing">
            Showing {start}-{end} of all {totalCount} blog posts
        </div>
    );
}

export default function LatestBlogPosts() {
    const [page, setPage] = React.useState(1);

    React.useLayoutEffect(
        () => window.scrollTo(0, 0),
        [page]
    );

    const {totalCount, searchFor} = useBlogContext();

    if (!totalCount) {
        return null;
    }

    const totalPages = Math.ceil(totalCount / perPage);

    return (
        <div className="latest-blog-posts page">
            <div className="boxed">
                <Breadcrumb name='Blog' />
                <HeadingAndSearchBar searchFor={searchFor} amongWhat='blog posts'>
                    <h1>Latest blog posts</h1>
                </HeadingAndSearchBar>
                <Showing page={page} />
                <LatestBlurbs page={page} pageSize={perPage} openInNewWindow />
                <SimplePaginator currentPage={page} setPage={setPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
