import React from 'react';
import useBlogContext, {assertTType, SubjectSnippet} from '../blog-context';
import {useParams} from 'react-router-dom';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import {WindowContextProvider} from '~/contexts/window';
import useDocumentHead from '~/helpers/use-document-head';
import PinnedArticle from '../pinned-article/pinned-article';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import MoreStories from '../more-stories/more-stories';
import Section from '~/components/explore-page/section/section';
import ArticleSummary, {
    blurbModel,
    PopulatedBlurbModel
} from '../article-summary/article-summary';

export default function ExplorePage() {
    useParamsToSetTopic();
    const {topic, pinnedStory, pageDescription, searchFor} = useBlogContext();
    const subject = useSubjectSnippetForTopic(topic);
    const heading = useTopicHeading(topic, subject);

    useDocumentHead({
        title: `${topic} blog posts - OpenStax`,
        description: pageDescription
    });

    return (
        <WindowContextProvider>
            <div className="boxed left">
                <Breadcrumb name="Blog" />
                <HeadingAndSearchBar
                    searchFor={searchFor}
                    amongWhat="blog posts"
                >
                    <HeadingForExplorePage {...{subject, heading}} />
                </HeadingAndSearchBar>
                <div className="explore-topic-blurb text-content">
                    {subject?.pageContent}
                </div>
                <PinnedArticle subhead={heading} />
                <Section
                    name="Popular blog posts"
                    topicHeading={heading}
                    className="popular-posts"
                >
                    <div
                        className="latest-blurbs cards"
                        data-analytics-content-list="Popular Blog Posts"
                    >
                        <PopularPosts />
                    </div>
                </Section>

                <MoreStories exceptSlug={pinnedStory?.slug} subhead={heading} />
            </div>
        </WindowContextProvider>
    );
}

function PopularPosts() {
    const {topicPopular, setPath} = useBlogContext();

    return topicPopular.map(blurbModel).map((article) => (
        <div className="card" key={article.articleSlug}>
            <ArticleSummary
                {...{
                    ...(article as PopulatedBlurbModel),
                    setPath,
                    HeadTag: 'h3'
                }}
            />
        </div>
    ));
}

// If it returns null, the topic is not a Subject
function useSubjectSnippetForTopic(topic?: string) {
    const {subjectSnippet} = useBlogContext();

    return subjectSnippet.find((s) => s.name === topic);
}

function useTopicHeading(topic?: string, subject?: SubjectSnippet) {
    const subjectHeading = React.useMemo(
        () => `OpenStax ${topic} Textbooks`,
        [topic]
    );

    return subject ? subjectHeading : topic;
}

function HeadingForExplorePage({
    subject,
    heading
}: {
    subject?: SubjectSnippet;
    heading?: string;
}) {
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

    React.useEffect(() => {
        setTypeAndTopic(assertTType(exploreType), topic);
        return () => setTypeAndTopic(undefined, undefined);
    }, [exploreType, topic, setTypeAndTopic]);
}
