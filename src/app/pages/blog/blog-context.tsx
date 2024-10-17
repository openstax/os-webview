import React from 'react';
import {useNavigate} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import buildContext from '~/components/jsx-helpers/build-context';
import useLatestBlogEntries from '~/models/blog-entries';
import useData from '~/helpers/use-data';

type NewsPageData = {
    title: string;
    interestBlock: {
        type: string;
        values: string;
        id: string;
    };
    footerText: string;
    footerButtonText: string;
    footerLink: string;
    meta: {
        slug: string;
        searchDescription: string;
    };
    displayFooter: boolean;
}

type SubjectEntry = {
    name: string;
    featured: boolean;
};

type CollectionEntry = {
    name: string;
    featured: boolean;
    popular: boolean;
};

type Article = {
    id: number;
    slug: string;
    title: string;
    heading: string;
    subheading?: string;
    bodyBlurb: string;
    articleImage?: string;
    articleImageAlt?: string;
    date: string;
    author: string;
    pinToTop: boolean;
    collections: CollectionEntry[];
    articleSubjects: SubjectEntry[];
    seoTitle: string;
    searchDescription: string;
}

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

type TType = string | undefined;

function useTopicStories() {
    const [topicType, setTopicType] = React.useState<TType>();
    const [topic, setTopic] = React.useState<TType>();
    const setTypeAndTopic = React.useCallback(
        (typ: TType, top: TType) => {
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
    const topicStories: Article[] = camelCaseKeys(useDataFromSlug(slug) || []);

    // Until search returns the heading field
    topicStories.forEach((s) => {
        if (!s.heading) {
            s.heading = s.title;
        }
    });

    const topicFeatured = React.useMemo(
        () => {
            const fieldFromType = topicType === 'subject' ? 'articleSubjects' : 'collections';
            const findFeatures = (story: Article) =>
                story[fieldFromType].some((s) => s.name === topic && s.featured);

            return topicStories.find(findFeatures);
        },
        [topicStories, topic, topicType]
    );
    const topicPopular = React.useMemo(
        () => topicStories.filter(
            (story: Article) => story.collections.some((c) => c.popular)
        ),
        [topicStories]
    );

    return ({topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular});
}

function useContextValue({footerText, footerButtonText, footerLink, meta}: NewsPageData) {
    const navigate = useNavigate();
    const {topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular} = useTopicStories();
    const pinnedData = useLatestBlogEntries(1);
    const pinnedStory = topicFeatured || (pinnedData && pinnedData[0]);
    const totalCount = pinnedData?.totalCount;
    const subjectSnippet = useEnglishSubjects();
    const collectionSnippet = useCollections();
    const setPath = React.useCallback(
        (href: string) => {
            const {pathname, search, hash} = new window.URL(href, window.location.href);

            navigate(`${pathname}${search}${hash}`);
            window.scrollTo(0, 0);
        },
        [navigate]
    );
    const searchFor = React.useCallback(
        (searchString: string) => setPath(`/blog/?q=${searchString}`),
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

function BlogContextProvider({children}: React.PropsWithChildren<object>) {
    const data = usePageData<NewsPageData>('news');

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
