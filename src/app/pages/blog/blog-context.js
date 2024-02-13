import React from 'react';
import {useNavigate} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import buildContext from '~/components/jsx-helpers/build-context';
import useLatestBlogEntries from '~/models/blog-entries';
import useData from '~/helpers/use-data';
const stayHere = {path: '/blog'};

function useEnglishSubjects() {
    return useData({
        slug: 'snippets/subjects?format=json&locale=en',
        camelCase: true
    }, []);
}

function useCollections() {
    return useData({
        slug: 'snippets/blogcollection?format=json',
        camelCase: true
    }, []);
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
            if (topicType.startsWith('subj')) {
                return `search/?subjects=${topic}`;
            }
            return `search/?collection=${topic}`;
        },
        [topic, topicType]
    );
    const topicStories = camelCaseKeys(useDataFromSlug(slug) || []);
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

function useContextValue({footerText, footerButtonText, footerLink, meta}) {
    const navigate = useNavigate();
    const {topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular} = useTopicStories();
    const pinnedData = useLatestBlogEntries(1);
    const pinnedStory = topicFeatured || (pinnedData && pinnedData[0]);
    const totalCount = pinnedData?.totalCount;
    const subjectSnippet = useEnglishSubjects();
    const collectionSnippet = useCollections();
    const setPath = React.useCallback(
        (href) => {
            const {pathname, search, hash} = new window.URL(href, window.location.href);

            navigate(`${pathname}${search}${hash}`, stayHere);
            window.scrollTo(0, 0);
        },
        [navigate]
    );
    const searchFor = React.useCallback(
        (searchString) => setPath(`/blog/?q=${searchString}`),
        [setPath]
    );

    if (pinnedStory && !pinnedStory.slug) {
        pinnedStory.slug = pinnedStory.meta.slug;
    }

    return {
        setPath, pinnedStory, totalCount, subjectSnippet, collectionSnippet,
        topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular,
        pageDescription: meta.searchDescription,
        footerText, footerButtonText, footerLink,
        searchFor
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

function BlogContextProvider({children}) {
    const data = usePageData('news');

    if (!data) {
        return null;
    }

    return (
        <ContextProvider contextValueParameters={data}>
            {children}
        </ContextProvider>
    );
}

export {
    useContext as default,
    BlogContextProvider
};
