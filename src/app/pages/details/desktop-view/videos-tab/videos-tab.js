import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './videos-tab.css';

export default function VideoTab({videos}) {
    return (
        <div className="videos-tab">
            {
                videos.map(({title, description, embed}) =>
                    <div className="video-block" key={title}>
                        <h2 className="title">{title}</h2>
                        <RawHTML html={description} className="description" />
                        <RawHTML html={embed} className="embed" embed />
                    </div>
                )
            }
        </div>
    );
}
