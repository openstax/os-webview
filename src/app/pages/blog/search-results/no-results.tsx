import React from 'react';
import PinnedArticle from '../pinned-article/pinned-article';
import {LatestBlurbs} from '../more-stories/more-stories';
import './no-results.scss';

export default function NoResults() {
    return (
        <div className='boxed left no-results'>
            <h1>No matching blog posts found</h1>
            <div>Our featured and recent blog posts are below.</div>
            <PinnedArticle />
            <LatestBlurbs page={1} pageSize={3} openInNewWindow />
        </div>
    );
}
