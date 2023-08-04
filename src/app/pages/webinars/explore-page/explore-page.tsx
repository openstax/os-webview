import React from 'react';
import useWebinarContext from '../webinar-context';
import useDocumentHead from '~/helpers/use-document-head';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';

export default function ExplorePage() {
    const {collections} = useWebinarContext();

    useDocumentHead({
        title: '** TOPIC WEBINARS **'
    });

    return (
        <div className='boxed left'>
            <Breadcrumb name='Webinars page' />
            <div>Heading and searchbar</div>
            <div>Featured webinar (pin to top?)</div>
            <div>Popular?</div>
            <div>Latest?</div>
        </div>
    );
}
