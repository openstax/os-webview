import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './videos-tab.scss';

type Video = {
    title: string;
    description: string;
    embed: string;
};

export default function VideoTab({videos}: {videos: Video[]}) {
    return (
        <div className="videos-tab">
            {videos.map(({title, description, embed}) => (
                <div className="video-block" key={title}>
                    <h2 className="title">{title}</h2>
                    <RawHTML
                        html={description}
                        className="description"
                    />
                    <RawHTML html={embed} className="embed" embed />
                </div>
            ))}
        </div>
    );
}
