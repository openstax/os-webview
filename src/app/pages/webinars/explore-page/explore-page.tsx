import React from 'react';
import useWebinarContext from '../webinar-context';
import useDocumentHead from '~/helpers/use-document-head';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import HeadingAndSearchBar from './heading-and-search-bar';
import Section from '~/components/explore-page/section/section';
import {useParams} from 'react-router-dom';
import SimplePaginator, {
    Showing
} from '~/components/paginator/simple-paginator';
import WebinarGrid from '../webinar-cards/webinar-grid';
import './explore-page.scss';

type ExploreType = 'subjects' | 'collections';
type SectionKey = 'popular' | 'featured';

const perPage = 9;

export default function ExplorePage() {
    const {exploreType, topic} = useParams();
    const topicHeading = `OpenStax ${topic} webinars`;
    const featuredWebinars = useFilteredWebinars(
        exploreType as ExploreType,
        topic as string,
        'featured'
    );
    const popularWebinars = useFilteredWebinars(
        exploreType as ExploreType,
        topic as string,
        'popular'
    );
    const latestWebinars = useFilteredWebinars(
        exploreType as ExploreType,
        topic as string
    );
    const [page, setPage] = React.useState(1);
    const currentPageOfWebinars = React.useMemo(() => {
        const numberNeeded = perPage * page;

        return latestWebinars.slice((page - 1) * perPage, numberNeeded);
    }, [page, latestWebinars]);
    const totalCount = latestWebinars.length;
    const totalPages = Math.ceil(totalCount / perPage);

    useDocumentHead({
        title: `${topic} Webinars`
    });

    return (
        <div className='explore-page boxed left'>
            <Breadcrumb name='Webinars page' />
            <HeadingAndSearchBar topic={topic as string} />
            {featuredWebinars.length > 0 && (
                <Section name='Featured webinar' topicHeading={topicHeading}>
                    <WebinarGrid webinars={featuredWebinars.slice(0, 3)} />
                </Section>
            )}
            {popularWebinars.length > 0 && (
                <Section name='Popular' topicHeading={topicHeading}>
                    <WebinarGrid webinars={popularWebinars.slice(0, 3)} />
                </Section>
            )}
            <Section
                name='Latest'
                topicHeading={topicHeading}
                id='explore-latest-section'
            >
                {totalCount < 1 ? (
                    <div>No webinars associated with {topic}</div>
                ) : (
                    <React.Fragment>
                        <Showing
                            page={page}
                            totalCount={totalCount}
                            perPage={perPage}
                            ofWhat='webinars'
                        />
                        <WebinarGrid webinars={currentPageOfWebinars} />
                        {totalPages > 1 ? (
                            <SimplePaginator
                                currentPage={page}
                                setPage={setPage}
                                totalPages={totalPages}
                            />
                        ) : null}
                    </React.Fragment>
                )}
            </Section>
        </div>
    );
}

function useFilteredWebinars(
    exploreType: ExploreType,
    topic: string,
    sectionKey?: SectionKey
) {
    const {latestWebinars} = useWebinarContext();

    return React.useMemo(
        () =>
            latestWebinars.filter((w) => {
                if (exploreType === 'subjects') {
                    const associations = w.subjects;
                    const hasAssociation = associations.some(
                        (a) =>
                            a.subject === topic &&
                            (!sectionKey ||
                                (sectionKey === 'featured' &&
                                    a[sectionKey] === 'True'))
                    );

                    return hasAssociation;
                }
                if (exploreType === 'collections') {
                    const associations = w.collections;
                    const hasAssociation = associations.some(
                        (a) =>
                            a.collection === topic &&
                            (!sectionKey || a[sectionKey] === 'True')
                    );

                    return hasAssociation;
                }
                return false;
            }),
        [exploreType, topic, sectionKey, latestWebinars]
    );
}
