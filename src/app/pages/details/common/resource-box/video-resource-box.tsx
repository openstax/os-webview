import React, { ReactComponentElement, ReactElement } from 'react';
import { useToggle } from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import Dialog from '~/components/dialog/dialog';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type VideoResourceBoxModelType = {
    heading: string,
    resourceHeading: string,
    resourceDescription: TrustedHTML,
    videoFile: string,
    videoTitle: string,
    resourceCategory: string
};

export default function VideoResourceBox({ model }: {model: VideoResourceBoxModelType}) {
    const [isOpen, toggle] = useToggle(false);
    const doToggle = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            toggle();
        },
        [toggle]
    );

    return (
        <div
            className="video resource-box"
            onClick={doToggle}
            key={model.resourceHeading}
        >
            <div>
                <div className="top-line">
                    <h3>{model.resourceHeading}</h3>
                </div>
                <RawHTML
                    className="description"
                    html={model.resourceDescription}
                />
                <video controls preload="metadata">
                    <source src={model.videoFile} type="video/avi" />
                </video>
            </div>
            <BottomBasic model={model} leftContent="Watch video" icon={faPlay} />
            <Dialog
                isOpen={isOpen}
                onPutAway={toggle}
                title={model.videoTitle || model.resourceHeading}
            >
                <ResourceVideoViewer file={model.videoFile} />
            </Dialog>
        </div>
    );
}

type VideoViewerArgs = { file: string };

function VideoViewer({ file }: VideoViewerArgs) {
    return (
        <div className="aspect-16-by-9-container">
            <video controls src={file} />
        </div>
    );
}

function ResourceVideoViewer(args: VideoViewerArgs) {
    return (
        <div className="instructor-resource-video-viewer">
            <VideoViewer {...args} />
        </div>
    );
}

type BottomBasicArgs = { leftContent: string | ReactElement, icon: IconProp, model: VideoResourceBoxModelType};

function BottomBasic({ leftContent, icon, model }: BottomBasicArgs) {
    return (
        <div className="bottom">
            <a
              className="left"
              data-analytics-select-content={model.heading}
              data-content-type={`Book Resource (${model.resourceCategory})`}
            >
                <FontAwesomeIcon icon={icon} />
                {leftContent}
            </a>
        </div>
    );
}

