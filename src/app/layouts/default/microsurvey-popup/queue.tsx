import React from 'react';
import useStickyMicrosurveyContent from './sticky-content';
import useAdoptionMicrosurveyContent from './adoption-content';

type NextItemFunction = () => void;
type OnDone = {onDone: NextItemFunction} | null;
type QueuedItemType = React.FC<
    React.PropsWithChildren<JSX.IntrinsicAttributes & OnDone>
>;
type UseContentHook = () => [boolean, QueuedItemType];

function useEnqueueWhenReady(
    useContent: UseContentHook,
    queue: QueuedItemType[],
    setQueue: (queue: QueuedItemType[]) => void
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

export default function useMSQueue(): [QueuedItemType | null, NextItemFunction] {
    const [queue, setQueue] = React.useState<QueuedItemType[]>([]);
    const nextItem = React.useCallback(
        () => setQueue(queue.slice(1)),
        [queue]
    );
    const QueuedItem = queue.length > 0 ? queue[0] : null;

    useEnqueueWhenReady(useStickyMicrosurveyContent as UseContentHook, queue, setQueue);
    useEnqueueWhenReady(useAdoptionMicrosurveyContent as UseContentHook, queue, setQueue);

    return [QueuedItem, nextItem];
}
