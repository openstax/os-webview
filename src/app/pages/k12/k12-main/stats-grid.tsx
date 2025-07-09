import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './stats-grid.scss';
import { K12Data, StatTexts } from './k12-main';

function StatsChecklistItem({heading, text}: {heading: string; text: string}) {
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

function PictureCard({imgSrc}: {imgSrc: string}) {
    const optimizedUrl = useOptimizedImage(imgSrc, 400);
    const style = {backgroundImage: `url(${optimizedUrl})`};

    return (
        <div className="card" style={style} />
    );
}

function StatsCard({boldStatText: line1, normalStatText: line2, imgSrc}:
    Partial<{
    imgSrc: string;
} & StatTexts>) {
    if (imgSrc) {
        return (<PictureCard imgSrc={imgSrc} />);
    }

    return (
        <div className="card">
            <strong>{line1}</strong>
            <div>{line2}</div>
        </div>
    );
}

export default function StatsGrid({data}: {data: K12Data}) {
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
                            (item) => <StatsCard key={JSON.stringify(item)} {...item} />
                        )
                    }
                </div>
            </div>
        </section>
    );
}
