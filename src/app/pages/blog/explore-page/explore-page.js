import React from 'react';
import useBlogContext from '../blog-context';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {WindowContextProvider} from '~/contexts/window';
import {Document} from '~/components/jsx-helpers/jsx-helpers.jsx';
import PinnedArticle from '../pinned-article/pinned-article';
import {HeadingAndSearchBar} from '../search-bar/search-bar';
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
    const {topic, pinnedStory, topicPopular, setPath, pageDescription} = useBlogContext();
    const navigate = useNavigate();
    const goBack = React.useCallback(
        (e) => {
            navigate(-1);
            e.preventDefault();
        },
        [navigate]
    );
    const subject = useSubjectSnippetForTopic(topic);
    const heading = useTopicHeading(topic, subject);

    return (
        <WindowContextProvider>
            <Document title={`${topic} blog posts - OpenStax`} description={pageDescription} />
            <div className="boxed left">
                <Link to="/blog" onClick={goBack} className="breadcrumb">
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Back to Main Blog</span>
                </Link>
                <HeadingAndSearchBar>
                    <HeadingForExplorePage {...{subject, heading}} />
                </HeadingAndSearchBar>
                <div className="explore-topic-blurb text-content">
                    {subject?.pageContent}
                </div>
                <PinnedArticle subhead={heading} />
                <div className="popular-posts">
                    <SectionHeader head="Popular blog posts" subhead={heading} />
                    <div className="latest-blurbs cards">
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
