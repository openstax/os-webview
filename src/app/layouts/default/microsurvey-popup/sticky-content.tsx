import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {useStickyData, useSeenCounter, BannerInfo as StickyData} from '../shared';

const SEEN_ENOUGH = 3;

function StickyContent({stickyData, children}: {stickyData: StickyData | undefined; children: React.ReactNode}) {
    if (!stickyData) {
        return null;
    }
    return (
        <div
            className="microsurvey-content"
            data-analytics-view
            data-analytics-nudge="donate"
            data-nudge-placement="popup"
        >
            {children}
            <RawHTML className="blurb" html={stickyData.body} />
            <a className="btn primary" href={stickyData.link_url} data-nudge-action="interacted">
                {stickyData.link_text}
            </a>
        </div>
    );
}

function useBoundStickyContent(stickyData: StickyData | undefined, incrementSeenCount: () => void) {
    // Increment seen count on each fresh load
    React.useEffect(
        () => incrementSeenCount(),
        [incrementSeenCount]
    );

    return React.useCallback(
        (props: {children: React.ReactNode}) => <StickyContent stickyData={stickyData} {...props} />,
        [stickyData]
    );
}

type StickyContentComponent = React.ComponentType<{children: React.ReactNode}>;

export default function useStickyMicrosurveyContent(): [boolean, StickyContentComponent] {
    const stickyData = useStickyData();
    const [hasBeenSeenEnough, incrementSeenCount] = useSeenCounter(SEEN_ENOUGH);
    const BoundStickyContent = useBoundStickyContent(stickyData?.bannerInfo, incrementSeenCount);

    const ready = Boolean(
        stickyData?.mode === 'popup' && !hasBeenSeenEnough
    );

    return [ready, BoundStickyContent];
}
