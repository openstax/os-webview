import React from 'react';
import useDocumentHead from '~/helpers/use-document-head';
import useWebinarContext from '../webinar-context';
import {HeadingAndSearchBar} from '../../../components/search-bar/search-bar';
import UpcomingWebinars from './upcoming-webinars';
import ExploreBy from '~/components/explore-by/explore-by';
import PastWebinars from './past-webinars';

export default function MainPage() {
    const {subjects, searchFor, pageData} = useWebinarContext();

    useDocumentHead({
        title: pageData.title
    });

    return (
        <div className="boxed">
            <HeadingAndSearchBar searchFor={searchFor} amongWhat="webinars">
                <h1>{pageData.heading}</h1>
            </HeadingAndSearchBar>
            <UpcomingWebinars />
            <ExploreBy
                items={subjects}
                title="Explore by subject"
                analyticsNav="Webinar Subjects"
            />
            <PastWebinars />
        </div>
    );
}
