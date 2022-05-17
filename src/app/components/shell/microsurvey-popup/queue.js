import {useState, useEffect} from 'react';
import useStickyMicrosurveyContent from './sticky-content';
import useAdoptionMicrosurveyContent from './adoption-content';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function useMSQueue() {
    const [queue, setQueue] = useState([]);
    const QueuedItem = queue.length > 0 ? queue[0] : null;

    function enqueue(Item) {
        setQueue([...queue, Item]);
    }
    function useEnqueueWhenReady(useContent) {
        const [ready, Item] = useContent();
        const [hasBeenEnqueued, toggle] = useToggle(false);

        useEffect(() => {
            if (ready) {
                enqueue(Item);
                toggle();
            } else if (hasBeenEnqueued) {
                setQueue(queue.slice(1));
            }
        }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
    }

    useEnqueueWhenReady(useStickyMicrosurveyContent);
    useEnqueueWhenReady(useAdoptionMicrosurveyContent);

    return [QueuedItem, () => setQueue(queue.slice(1))];
}
