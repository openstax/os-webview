import React from 'react';
import PinnedArticle from '../pinned-article/pinned-article';
import Section from '~/components/explore-page/section/section';
import {LatestBlurbs} from '../more-stories/more-stories';
import './no-results.scss';

export default function NoResults() {
    return (
        <div className='boxed left no-results'>
            <h1>No matching blog posts found</h1>
            <div>Our featured and recent blog posts are below.</div>
            <PinnedArticle />
            <Section className="more-stories" name="Latest blog posts">
                <LatestBlurbs page={1} pageSize={3} openInNewWindow />
            </Section>
        </div>
    );
}
