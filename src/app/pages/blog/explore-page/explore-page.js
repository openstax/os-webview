import React from 'react';
import useBlogContext from '../blog-context';
import {useParams} from 'react-router-dom';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import {WindowContextProvider} from '~/contexts/window';
import useDocumentHead from '~/helpers/use-document-head';
import PinnedArticle from '../pinned-article/pinned-article';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import MoreStories from '../more-stories/more-stories';
import SectionHeader from '../section-header/section-header';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';

// If it returns null, the topic is not a Subject
function useSubjectSnippetForTopic(topic) {
    const {subjectSnippet} = useBlogContext();

    return subjectSnippet.find((s) => s.name === topic);
}

function useTopicHeading(topic, subject) {
    const subjectHeading = React.useMemo(
        () => `OpenStax ${topic} Textbooks`,
        [topic]
    );

    return subject ? subjectHeading : topic;
}

function HeadingForExplorePage({subject, heading}) {
    return (
        <h1 className="not-so-big">
            {subject?.subjectIcon && <img src={subject.subjectIcon} />}
            <span>{heading}</span>
        </h1>
    );
}

function useParamsToSetTopic() {
    const {exploreType, topic} = useParams();
    const {setTypeAndTopic} = useBlogContext();

    React.useEffect(
        () => {
            setTypeAndTopic(exploreType, topic);
            return () => setTypeAndTopic();
        },
        [exploreType, topic, setTypeAndTopic]
    );
}

export default function ExplorePage() {
    useParamsToSetTopic();
    const {topic, pinnedStory, topicPopular, setPath, pageDescription, searchFor} = useBlogContext();
    const subject = useSubjectSnippetForTopic(topic);
    const heading = useTopicHeading(topic, subject);

    useDocumentHead({
        title: `${topic} blog posts - OpenStax`,
        description: pageDescription
    });

    return (
        <WindowContextProvider>
            <div className="boxed left">
                <Breadcrumb name="Main Blog" />
                <HeadingAndSearchBar searchFor={searchFor} amongWhat='blog posts'>
                    <HeadingForExplorePage {...{subject, heading}} />
                </HeadingAndSearchBar>
                <div className="explore-topic-blurb text-content">
                    {subject?.pageContent}
                </div>
                <PinnedArticle subhead={heading} />
                <div className="popular-posts">
                    <SectionHeader head="Popular blog posts" subhead={heading} />
                    <div
                        className="latest-blurbs cards"
                        data-analytics-content-list="Popular Blog Posts"
                    >
                        {
                            topicPopular.map(blurbModel).map((article) =>
                                <div className="card" key={article.articleSlug}>
                                    <ArticleSummary {...{...article, setPath, HeadTag: 'h3'}} />
                                </div>
                            )
                        }
                    </div>
                </div>
                <MoreStories exceptSlug={pinnedStory?.slug} subhead={heading} />
            </div>
        </WindowContextProvider>
    );
}
