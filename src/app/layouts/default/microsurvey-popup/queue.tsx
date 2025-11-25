import React from 'react';
import useStickyMicrosurveyContent from './sticky-content';
import useAdoptionMicrosurveyContent from './adoption-content';

type MicrosurveyComponent = React.ComponentType<{children: React.ReactNode}>;
type UseContentHook = () => [boolean, MicrosurveyComponent];

function useEnqueueWhenReady(
    useContent: UseContentHook,
    queue: MicrosurveyComponent[],
    setQueue: (queue: MicrosurveyComponent[]) => void
) {
    const [ready, Item] = useContent();
    const [hasQueued, setHasQueued] = React.useState(false);

    React.useEffect(
        () => {
            if (!hasQueued && ready && !queue.includes(Item)) {
                setQueue([...queue, Item]);
                setHasQueued(true);
            }
            if (!ready && queue.includes(Item)) {
                setQueue(queue.slice(1));
            }
        },
        [ready, queue, setQueue, Item, hasQueued]
    );
}

export default function useMSQueue(): [MicrosurveyComponent | null, () => void] {
    const [queue, setQueue] = React.useState<MicrosurveyComponent[]>([]);
    const nextItem = React.useCallback(
        () => setQueue(queue.slice(1)),
        [queue]
    );
    const QueuedItem = queue.length > 0 ? queue[0] : null;

    useEnqueueWhenReady(useStickyMicrosurveyContent, queue, setQueue);
    useEnqueueWhenReady(useAdoptionMicrosurveyContent, queue, setQueue);

    return [QueuedItem, nextItem];
}
