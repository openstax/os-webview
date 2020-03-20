import React, {useState} from 'react';
import ResultCard from './result-card.jsx';

function modelFromEntry(entry) {
    return {
        title: entry.title,
        logoUrl: entry.logoUrl,
        description: entry.blurb,
        tags: entry.tags,
        verifiedFeatures: entry.verifiedFeatures,
        badgeImage: '/images/partners/verified-badge.svg'
    };
}

export default function (props) {
    const {entries, emitSelect} = props;

    return (
        <div className="boxed grid">
            {
                entries.map((entry) =>
                    <ResultCard key={entry.title}
                        model={modelFromEntry(entry)}
                        emitSelect={() => emitSelect(entry)}
                    />
                )
            }
        </div>
    );
};
