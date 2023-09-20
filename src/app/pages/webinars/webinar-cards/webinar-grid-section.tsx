import React from 'react';
import WebinarGrid from './webinar-grid';
import {Webinar} from '../types';
import './webinar-grid-section.scss';

type WebinarFilter = (w: Webinar) => boolean;
type Args = {
    heading: string;
    webinars: Webinar[];
    filter?: WebinarFilter;
    limit?: number;
};

export default function LabeledWebinarGrid({
    heading,
    webinars,
    filter = () => true,
    limit = 3,
    children
}: React.PropsWithChildren<Args>) {
    const filteredWebinars = React.useMemo(
        () => webinars.filter(filter).slice(0, limit),
        [webinars, filter, limit]
    );

    if (webinars.length === 0) {
        return null;
    }

    return (
        <section className='webinar-grid-section'>
            <h2>{heading}</h2>
            <WebinarGrid webinars={filteredWebinars} />
            {children}
        </section>
    );
}
