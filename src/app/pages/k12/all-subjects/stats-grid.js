import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import './stats-grid.scss';

function StatsChecklistItem({heading, text}) {
    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faCheckCircle} />
            <div>
                <strong>{heading}</strong>
                <div>{text}</div>
            </div>
        </React.Fragment>
    );
}

function StatsCard({boldStatText: line1, normalStatText: line2, imgSrc}) {
    const style = imgSrc ? {backgroundImage: `url(${imgSrc})`} : null;

    return (
        <div className="card" style={style}>
            {line1 ? <strong>{line1}</strong> : null}
            {line2 ? <div>{line2}</div> : null}
        </div>
    );
}

export default function StatsGrid({data}) {
    const gridItems = [
        data.statsGrid[0][0],
        {imgSrc: data.statsImage1.meta.downloadUrl},
        {imgSrc: data.statsImage2.meta.downloadUrl},
        data.statsGrid[0][1],
        data.statsGrid[0][2],
        {imgSrc: data.statsImage3.meta.downloadUrl}
    ];

    return (
        <section className="stats-grid">
            <div className="boxed">
                <div>
                    <RawHTML Tag='h3' html={data.highlightsHeader} />
                    <div className="checklist">
                        {
                            data.highlights[0].map(
                                (item) =>
                                    <StatsChecklistItem
                                        key={item.highlightSubheader}
                                        heading={item.highlightSubheader}
                                        text={item.highlightText}
                                    />
                            )
                        }
                    </div>
                </div>
                <div className="card-grid">
                    {
                        gridItems.map(
                            (item) => <StatsCard key={item} {...item} />
                        )
                    }
                </div>
            </div>
        </section>
    );
}
