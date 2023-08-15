import React from 'react';
import useDocumentHead from '~/helpers/use-document-head';
import useWebinarContext from '../webinar-context';
import {HeadingAndSearchBar} from '../../../components/search-bar/search-bar';
import ExploreBySubject from '~/components/explore-by-subject/explore-by-subject';
import ExploreByCollection from '~/components/explore-by-collection/explore-by-collection';
import LatestWebinars from '../webinar-cards/latest-webinars';

export default function MainPage() {
    const {subjects, searchFor, pageData, collections} = useWebinarContext();

    useDocumentHead({
        title: pageData.title
    });

    return (
        <div className='boxed'>
            <HeadingAndSearchBar searchFor={searchFor} amongWhat='webinars'>
                <h1>{pageData.heading}</h1>
            </HeadingAndSearchBar>
            <ExploreBySubject
                categories={subjects}
                analyticsNav='Webinar Subjects'
            />
            <ExploreByCollection
                collections={collections}
                analyticsNav='Blog Collections'
            />
            <LatestWebinars />
        </div>
    );
}
