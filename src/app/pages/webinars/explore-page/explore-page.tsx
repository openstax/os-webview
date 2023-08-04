import React from 'react';
import useWebinarContext from '../webinar-context';
import useDocumentHead from '~/helpers/use-document-head';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import HeadingAndSearchBar from './heading-and-search-bar';
import Section from '~/components/explore-page/section/section';
import {useParams} from 'react-router-dom';
import './explore-page.scss';

export default function ExplorePage() {
    const {collections} = useWebinarContext();
    const {topic} = useParams();
    const topicHeading = `OpenStax ${topic} webinars`;

    useDocumentHead({
        title: `${topic} Webinars`
    });

    return (
        <div className='explore-page boxed left'>
            <Breadcrumb name='Webinars page' />
            <HeadingAndSearchBar topic={topic as string} />
            <Section name='Featured webinar' topicHeading={topicHeading}>
                <div>? Webinar content pin-to-top ?</div>
            </Section>
            <Section name='Popular' topicHeading={topicHeading}>
                <div>? Popular?</div>
            </Section>
            <Section name='Latest' topicHeading={topicHeading}>
                <div>Latest?</div>
            </Section>
        </div>
    );
}
