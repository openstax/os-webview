import React from 'react';
import {LatestBlurbs} from '../more-stories/more-stories';
import {HeadingAndSearchBar} from '../search-bar/search-bar';
import SimplePaginator from '~/components/paginator/simple-paginator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import useBlogContext from '../blog-context';
import './latest-blog-posts.scss';

const perPage = 9;

function Showing({page}) {
    const {totalCount} = useBlogContext();
    const end = page * perPage;
    const start = end - perPage + 1;

    return (
        <div className="whats-showing">
            Showing {start}-{end} of all {totalCount} blog posts
        </div>
    );
}

export default function LatestBlogPosts() {
    const [page, setPage] = React.useState(1);
    const {totalCount} = useBlogContext();
    const totalPages = Math.ceil(totalCount / perPage);

    React.useLayoutEffect(
        () => window.scrollTo(0, 0),
        [page]
    );

    return (
        <div className="latest-blog-posts page">
            <div className="boxed">
                <a className="breadcrumb" href="/blog">
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Back to Main Blog
                </a>
                <HeadingAndSearchBar>
                    <h1>Latest blog posts</h1>
                </HeadingAndSearchBar>
                <Showing page={page} />
                <LatestBlurbs page={page} pageSize={perPage} />
                <SimplePaginator currentPage={page} setPage={setPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
