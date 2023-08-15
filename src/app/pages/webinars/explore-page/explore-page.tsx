import React from 'react';
import useWebinarContext from '../webinar-context';
import useDocumentHead from '~/helpers/use-document-head';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import HeadingAndSearchBar from './heading-and-search-bar';
import Section from '~/components/explore-page/section/section';
import {useParams} from 'react-router-dom';
import {WebinarGrid} from '../webinar-cards/latest-webinars';
import './explore-page.scss';

type ExploreType = 'subjects' | 'collections';
type SectionKey = 'popular' | 'featured';

export default function ExplorePage() {
    const {exploreType, topic} = useParams();
    const topicHeading = `OpenStax ${topic} webinars`;
    const featuredWebinars = useFilteredWebinars(
        exploreType as ExploreType,
        topic,
        'featured'
    );
    const popularWebinars = useFilteredWebinars(
        exploreType as ExploreType,
        topic,
        'popular'
    );
    const latestWebinars = useFilteredWebinars(
        exploreType as ExploreType,
        topic
    );

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
            <Section name='Latest' topicHeading={topicHeading}>
                <WebinarGrid webinars={latestWebinars.slice(0, 3)} />
            </Section>
        </div>
    );
}

function useFilteredWebinars(
    exploreType?: ExploreType,
    topic?: string,
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
