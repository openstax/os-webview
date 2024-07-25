import React from 'react';
import useStickyMicrosurveyContent from './sticky-content';
import useAdoptionMicrosurveyContent from './adoption-content';

function useEnqueueWhenReady(useContent, queue, setQueue) {
    const [ready, Item] = useContent();
    const [hasQueued, setHasQueued] = React.useState(false);

    React.useEffect(
        // eslint-disable-next-line complexity
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

export default function useMSQueue() {
    const [queue, setQueue] = React.useState([]);
    const nextItem = React.useCallback(
        () => setQueue(queue.slice(1)),
        [queue]
    );
    const QueuedItem = queue.length > 0 ? queue[0] : null;

    useEnqueueWhenReady(useStickyMicrosurveyContent, queue, setQueue);
    useEnqueueWhenReady(useAdoptionMicrosurveyContent, queue, setQueue);

    return [QueuedItem, nextItem];
}
