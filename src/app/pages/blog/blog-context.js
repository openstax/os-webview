import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import buildContextLoader from '~/components/jsx-helpers/context-loader';
import useLatestBlogEntries from '~/models/blog-entries';
import cmsFetch from '~/helpers/cms-fetch';
import $ from '~/helpers/$';

const stayHere = {path: '/blog'};

function useEnglishSubjects() {
    const [data, setData] = React.useState([]);

    React.useEffect(
        () => cmsFetch('snippets/subjects?format=json&locale=en')
            .then($.camelCaseKeys)
            .then(setData),
        []
    );

    return data;
}

function useCollections() {
    const [data, setData] = React.useState([]);

    React.useEffect(
        () => cmsFetch('snippets/blogcollection?format=json')
            .then($.camelCaseKeys)
            .then(setData),
        []
    );

    return data;
}

function useTopicStories() {
    const [topicType, setTopicType] = React.useState();
    const [topic, setTopic] = React.useState();
    const setTypeAndTopic = React.useCallback(
        (typ, top) => {
            setTopicType(typ);
            setTopic(top);
        },
        []
    );
    const slug = React.useMemo(
        () => {
            if (!topicType) {
                return null;
            }
            if (topicType === 'subject') {
                return `search/?subjects=${topic}`;
            }
            return `search/?collection=${topic}`;
        },
        [topic, topicType]
    );
    const topicStories = $.camelCaseKeys(useDataFromSlug(slug) || []);
    const topicFeatured = React.useMemo(
        () => {
            const fieldFromType = topicType === 'subject' ? 'articleSubjects' : 'collections';
            const findFeatures = (story) =>
                story[fieldFromType].some((s) => s.name === topic && s.featured);

            return topicStories.find(findFeatures);
        },
        [topicStories, topic, topicType]
    );
    const topicPopular = React.useMemo(
        () => topicStories.filter(
            (story) => story.collections.some((c) => c.popular)
        ),
        [topicStories]
    );

    return ({topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular});
}

function useContextValue(pageData) {
    const navigate = useNavigate();
    const {topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular} = useTopicStories();
    const pinnedData = useLatestBlogEntries(1);
    const pinnedStory = topicFeatured || (pinnedData && pinnedData[0]);
    const totalCount = pinnedData?.totalCount;
    const subjectSnippet = useEnglishSubjects();
    const collectionSnippet = useCollections();

    if (pinnedStory && !pinnedStory.slug) {
        pinnedStory.slug = pinnedStory.meta.slug;
    }

    function setPath(href) {
        const {pathname, search, hash} = new window.URL(href, window.location.href);

        navigate(`${pathname}${search}${hash}`, stayHere);
        window.scrollTo(0, 0);
    }

    return {
        setPath, pinnedStory, totalCount, subjectSnippet, collectionSnippet,
        topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular,
        pageDescription: pageData.meta.search_description
    };
}

const {useContext, ContextLoader} = buildContextLoader();

export function BlogContextProvider({children}) {
    return (
        <ContextLoader
            slug="news" useContextValue={useContextValue}
            doDocumentSetup noCamelCase
        >
            {children}
        </ContextLoader>
    );
}

export default useContext;
