import React from 'react';
import useBlogContext from '../blog-context';
import {useParams, Link, useHistory} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {WindowContextProvider} from '~/contexts/window';
import PinnedArticle from '../pinned-article/pinned-article';
import {HeadingAndSearchBar} from '../search-bar/search-bar';
import MoreStories from '../more-stories/more-stories';
import SectionHeader from '../section-header/section-header';

function Document({title}) {
    React.useLayoutEffect(
        () => {
            console.info('Setting title...');
            document.title = title;
        },
        [title]
    );

    return null;
}

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

export default function ExplorePage() {
    const {topic} = useParams();
    const {pinnedStory} = useBlogContext();
    const history = useHistory();
    const goBack = React.useCallback(
        (e) => {
            history.goBack();
            e.preventDefault();
        },
        [history]
    );
    const subject = useSubjectSnippetForTopic(topic);
    const heading = useTopicHeading(topic, subject);

    return (
        <WindowContextProvider>
            <Document title={`${topic} blog posts - OpenStax`} />
            <div className="boxed left">
                <Link to="/blog" onClick={goBack} className="breadcrumb">
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Back to Main Blog</span>
                </Link>
                <HeadingAndSearchBar>
                    <HeadingForExplorePage {...{subject, heading}} />
                </HeadingAndSearchBar>
                <div className="explore-topic-blurb text-content">
                    About this much text. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </div>
                <PinnedArticle subhead={heading} />
                <div className="popular-posts">
                    <SectionHeader head="Popular blog posts" subhead={heading} />
                </div>
                <MoreStories exceptSlug={pinnedStory && pinnedStory.meta.slug} subhead={heading} />
            </div>
        </WindowContextProvider>
    );
}
