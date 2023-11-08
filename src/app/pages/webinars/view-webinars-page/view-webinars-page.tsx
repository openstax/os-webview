import React from 'react';
import Breadcrumb from '~/components/breadcrumb/breadcrumb';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import useWebinarContext from '../webinar-context';
import PaginatedWebinarGrid from '../webinar-cards/paginated-webinar-grid';
import {Webinar} from '../types';

export default function ViewWebinarsPage({
    heading = 'Webinars',
    webinars
}: {
    heading?: string;
    webinars: Webinar[];
}) {
    return (
        <div className='view-webinars-page boxed left'>
            <Breadcrumb name='Webinars page' />
            <WebinarHSB heading={heading} />
            <PaginatedWebinarGrid
                webinars={webinars}
            />
        </div>
    );
}

function WebinarHSB({heading}: {heading: string}) {
    const {searchFor} = useWebinarContext();

    return (
        <HeadingAndSearchBar searchFor={searchFor} amongWhat='webinars'>
            <h1>{heading}</h1>
        </HeadingAndSearchBar>
    );
}
