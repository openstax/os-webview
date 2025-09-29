import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {useStickyData, useSeenCounter} from '../shared';

const SEEN_ENOUGH = 3;

type StickyContentProps = {
    stickyData: ReturnType<typeof useStickyData>;
    children: React.ReactNode;
};

function StickyContent({stickyData, children}: StickyContentProps) {
    return (
        <div
            className="microsurvey-content"
            data-analytics-view
            data-analytics-nudge="donate"
            data-nudge-placement="popup"
        >
            {children}
            <RawHTML className="blurb" html={stickyData?.bannerInfo.body} />
            <a className="btn primary" href={stickyData?.bannerInfo.link_url} data-nudge-action="interacted">
                {stickyData?.bannerInfo.link_text}
            </a>
        </div>
    );
}

function useBoundStickyContent(
    stickyData: StickyContentProps['stickyData'],
    incrementSeenCount: () => void
) {
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

export default function useStickyMicrosurveyContent(): [
    boolean,
    (props: {children: React.ReactNode}) => JSX.Element
] {
    const stickyData = useStickyData();
    const [hasBeenSeenEnough, incrementSeenCount] = useSeenCounter(SEEN_ENOUGH);
    const BoundStickyContent = useBoundStickyContent(stickyData, incrementSeenCount);

    const ready = Boolean(
        stickyData?.mode === 'popup' && !hasBeenSeenEnough
    );

    return [ready, BoundStickyContent];
}
