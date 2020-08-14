import React, {useState, useEffect} from 'react';
import useStickyMicrosurveyContent from './sticky-content';
import useAdoptionMicrosurveyContent from './adoption-content';

export default function useMSQueue() {
    const [queue, setQueue] = useState([]);
    const QueuedItem = queue.length > 0 ? queue[0] : null;

    function enqueue(Item) {
        setQueue([...queue, Item]);
    }
    function useEnqueueWhenReady(useContent) {
        const [ready, Item] = useContent();

        useEffect(() => {
            if (ready) {
                enqueue(Item);
            }
        }, [ready, Item]);
    }

    useEnqueueWhenReady(useStickyMicrosurveyContent);
    useEnqueueWhenReady(useAdoptionMicrosurveyContent);

    return [QueuedItem, () => setQueue(queue.slice(1))];
}
