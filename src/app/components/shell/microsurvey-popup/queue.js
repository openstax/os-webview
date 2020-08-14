import React, {useState, useEffect} from 'react';
import useStickyMicrosurveyContent from './stickyContent';

export default function useMSQueue() {
    const [queue, setQueue] = useState([]);
    const QueuedItem = queue.length > 0 ? queue[0] : null;

    function enqueue(Item) {
        setQueue([...queue, Item]);
    }
    function enqueueWhenReady(useContent) {
        const [ready, Item] = useContent();

        useEffect(() => {
            if (ready) {
                enqueue(Item);
            }
        }, [ready]);
    }

    enqueueWhenReady(useStickyMicrosurveyContent);

    return [QueuedItem, () => setQueue(queue.slice(1))];
}
