import React from 'react';
import {useNavigate} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import buildContext from '~/components/jsx-helpers/build-context';
import useLatestBlogEntries from '~/models/blog-entries';
import useData from '~/helpers/use-data';

type Meta = {
    slug: string;
    searchDescription: string;
}

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
    meta: Meta;
    displayFooter: boolean;
};

export type SubjectEntry = {
    name: string;
    featured: boolean;
};

export type CollectionEntry = {
    name: string;
    featured: boolean;
    popular: boolean;
};

export type ArticleSummary = {
    articleImage: string;
    articleImageAlt?: string;
    articleSubjects: SubjectEntry[];
    author: string;
    bodyBlurb: string;
    collections: CollectionEntry[];
    contentTypes: string[];
    date: string;
    heading: string;
    id: number;
    meta: Meta;
    pinToTop: boolean;
    searchDescription: string;
    seoTitle: string;
    slug: string;
    title: string;
    subheading: string;
    tags: string[];
};

export type SubjectSnippet = {
    id: number;
    name: string;
    pageContent: string;
    seoTitle: string;
    searchDescription: string;
    subjectIcon: string;
    subjectColor: string;
};

function useEnglishSubjects() {
    return useData<SubjectSnippet[]>(
        {
            slug: 'snippets/subjects?format=json&locale=en',
            camelCase: true
        },
        []
    );
}

function useCollections() {
    return useData(
        {
            slug: 'snippets/blogcollection?format=json',
            camelCase: true
        },
        []
    );
}

export type TType = undefined | 'subjects' | 'collections';

export function assertTType(s: string | undefined) {
    if (s === undefined || ['subjects', 'collections'].includes(s)) {
        return s as TType;
    }
    throw new Error(`Topic type is invalid: ${s}`);
}

function useTopicStories() {
    const [topicType, setTopicType] = React.useState<TType>();
    const [topic, setTopic] = React.useState<string>();
    const setTypeAndTopic = React.useCallback((typ: TType, top?: string) => {
        setTopicType(typ);
        setTopic(top);
    }, []);
    const slug = React.useMemo(() => {
        if (!topicType) {
            return null;
        }
        if (topicType.startsWith('subj')) {
            return `search/?subjects=${topic}`;
        }
        return `search/?collection=${topic}`;
    }, [topic, topicType]);
    const topicStories = camelCaseKeys(
        useDataFromSlug(slug) || []
    ) as ArticleSummary [];

    // Until search returns the heading field
    topicStories.forEach((s) => {
        if (!s.heading) {
            s.heading = s.title;
        }
    });

    const topicFeatured = React.useMemo(() => {
        const fieldFromType =
            topicType === 'subjects' ? 'articleSubjects' : 'collections';
        const findFeatures = (story: ArticleSummary) =>
            story[fieldFromType].some((s) => s.name === topic && s.featured);

        return topicStories.find(findFeatures);
    }, [topicStories, topic, topicType]);
    const topicPopular = React.useMemo(
        () =>
            topicStories.filter((story: ArticleSummary) =>
                story.collections.some((c) => c.popular)
            ),
        [topicStories]
    );

    return {topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular};
}

function useContextValue({
    footerText,
    footerButtonText,
    footerLink,
    meta
}: NewsPageData) {
    const navigate = useNavigate();
    const {topic, setTypeAndTopic, topicStories, topicFeatured, topicPopular} =
        useTopicStories();
    const pinnedData = useLatestBlogEntries(1);
    const pinnedStory = topicFeatured || pinnedData?.[0] as ArticleSummary;
    const totalCount = pinnedData?.totalCount;
    const subjectSnippet = useEnglishSubjects();
    const collectionSnippet = useCollections();
    const setPath = React.useCallback(
        (href: string) => {
            const {pathname, search, hash} = new window.URL(
                href,
                window.location.href
            );

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
        setPath,
        pinnedStory,
        totalCount,
        subjectSnippet,
        collectionSnippet,
        topic,
        setTypeAndTopic,
        topicStories,
        topicFeatured,
        topicPopular,
        pageDescription: meta.searchDescription,
        footerText,
        footerButtonText,
        footerLink,
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

export {useContext as default, BlogContextProvider};
