import React from 'react';
import {useParams} from 'react-router-dom';
import './section.scss';

type SectionArgs = React.PropsWithChildren<{
    name: string;
    topicHeading?: string;
}> & React.HTMLAttributes<HTMLDivElement>;

export default function Section({name, topicHeading, children, ...divAttributes}: SectionArgs) {
    return (
        <section {...divAttributes}>
            <SectionHeader head={name} subhead={topicHeading} />
            {children}
        </section>
    );
}

type SectionHeaderArgs = {
    head: string;
    subhead?: string;
}

function SectionHeader({head, subhead}: SectionHeaderArgs) {
    return (
        <h2 className="section-header">
            {head}
            {subhead && <span className="section-subhead">{subhead}</span>}
        </h2>
    );
}
